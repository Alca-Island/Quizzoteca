export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface GameSessionState {
  sessionId: string;
  quizId: string;
  players: Player[];
  activeSectionId: string | null;
  startTime: number;
  lastActive: number;
}
