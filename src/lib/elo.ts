export function calculateEloChange(winnerElo: number, loserElo: number): number {
  const K = 32; // K-factor determines how much ratings can change
  const expectedScore = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  return Math.round(K * (1 - expectedScore));
}

export function calculateTeamElo(playerElos: number[]): number {
  return playerElos.reduce((sum, elo) => sum + elo, 0) / playerElos.length;
}