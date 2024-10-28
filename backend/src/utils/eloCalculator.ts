const K_FACTOR = 32; // Standard K-factor, can be adjusted

export interface TeamEloResult {
    playerId: string;
    oldElo: number;
    newElo: number;
    change: number;
}

export function calculateTeamElo(team: number[]): number {
    return team.reduce((sum, elo) => sum + elo, 0) / team.length;
}

export function calculateExpectedScore(teamElo: number, opposingTeamElo: number): number {
    return 1 / (1 + Math.pow(10, (opposingTeamElo - teamElo) / 400));
}

export function calculateNewElos(
    team1Players: { id: string, elo: number }[],
    team2Players: { id: string, elo: number }[],
    team1Score: number,
    team2Score: number
): { team1Results: TeamEloResult[], team2Results: TeamEloResult[] } {
    const team1Avg = calculateTeamElo(team1Players.map(p => p.elo));
    const team2Avg = calculateTeamElo(team2Players.map(p => p.elo));

    // Calculate actual score (1 for win, 0.5 for draw, 0 for loss)
    const actualScore = team1Score > team2Score ? 1 : team1Score === team2Score ? 0.5 : 0;

    const expectedScore = calculateExpectedScore(team1Avg, team2Avg);

    // Calculate ELO changes for each player
    const team1Results = team1Players.map(player => {
        const eloChange = Math.round(K_FACTOR * (actualScore - expectedScore));
        return {
            playerId: player.id,
            oldElo: player.elo,
            newElo: player.elo + eloChange,
            change: eloChange
        };
    });

    const team2Results = team2Players.map(player => {
        const eloChange = Math.round(K_FACTOR * ((1 - actualScore) - (1 - expectedScore)));
        return {
            playerId: player.id,
            oldElo: player.elo,
            newElo: player.elo + eloChange,
            change: eloChange
        };
    });

    return { team1Results, team2Results };
}
