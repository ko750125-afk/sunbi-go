export interface Stone {
  x: number;
  y: number;
  color: 'black' | 'white';
}

export interface Problem {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  boardSize: number;
  stones: Stone[];
  solution: string[];
  explanation: string;
}

export interface ProblemsData {
  problems: Problem[];
}

export interface GameRecord {
  problemId: number;
  solved: boolean;
  attempts: number;
  solvedAt?: string;
}

export interface GameStats {
  records: GameRecord[];
}
