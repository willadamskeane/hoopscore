import { Request, Response } from 'express';
import Game, { IGame } from '../models/Game';
import Player, { IPlayer } from '../models/Player';
import { calculateNewElos, TeamEloResult } from '../utils/eloCalculator';

export const submitGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const { team1PlayerIds, team2PlayerIds, team1Score, team2Score } = req.body;

    // Fetch all players
    const team1Players = await Player.find({ _id: { $in: team1PlayerIds } });
    const team2Players = await Player.find({ _id: { $in: team2PlayerIds } });

    // Prepare player data for ELO calculation
    const team1Data = team1Players.map(p => ({ id: p._id.toString(), elo: p.eloRating }));
    const team2Data = team2Players.map(p => ({ id: p._id.toString(), elo: p.eloRating }));

    // Calculate new ELO ratings
    const { team1Results, team2Results } = calculateNewElos(
      team1Data,
      team2Data,
      team1Score,
      team2Score
    );

    // Create game record
    const game = new Game({
      team1: team1PlayerIds,
      team2: team2PlayerIds,
      team1Score,
      team2Score,
      eloChanges: [...team1Results, ...team2Results].map(result => ({
        playerId: result.playerId,
        change: result.change
      }))
    });

    await game.save();

    // Update player statistics
    const allResults = [...team1Results, ...team2Results];
    await updatePlayerStats(
      allResults,
      team1PlayerIds,
      team2PlayerIds,
      team1Score,
      team2Score
    );

    res.status(201).json({
      message: 'Game recorded successfully',
      game,
      eloChanges: allResults
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting game', error });
  }
};

export const getGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const games = await Game.find()
      .populate('team1', 'username')
      .populate('team2', 'username')
      .sort({ date: -1 });
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching games', error });
  }
};

async function updatePlayerStats(
  eloResults: TeamEloResult[],
  team1PlayerIds: string[],
  team2PlayerIds: string[],
  team1Score: number,
  team2Score: number
): Promise<void> {
  const bulkOps = eloResults.map(result => {
    const isTeam1 = team1PlayerIds.includes(result.playerId);
    const won = isTeam1 ? team1Score > team2Score : team2Score > team1Score;
    const drew = team1Score === team2Score;

    return {
      updateOne: {
        filter: { _id: result.playerId },
        update: {
          $set: { eloRating: result.newElo },
          $inc: {
            gamesPlayed: 1,
            wins: won ? 1 : 0,
            draws: drew ? 1 : 0,
            losses: !won && !drew ? 1 : 0
          }
        }
      }
    };
  });

  await Player.bulkWrite(bulkOps);
}
