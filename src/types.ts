export type DigitsCount = 1 | 2 | 3 | 4 | 5 | 6;

export type OperationMode = 'addition' | 'addition_subtraction';

export interface CalculationConfig {
  digits: DigitsCount;
  casesCount: number; // multiples of 5, from 5 to 50
  operationMode: OperationMode;
  intervalSeconds: number; // 0.1 to 1.0
}

export interface CaseNumber {
  index: number;
  value: number; // e.g. 7, -4
  isNegative: boolean;
  absoluteValue: number;
  displayString: string; // "+7" or "7", "-4"
  runningTotal: number;
}

export type GamePhase = 'config' | 'countdown' | 'flashing' | 'input' | 'result';

export interface GameResult {
  id: string;
  config: CalculationConfig;
  sequence: CaseNumber[];
  expectedTotal: number;
  userAnswer: number | null;
  isCorrect: boolean;
  timeTakenMs: number;
  timestamp: number;
}

export interface SessionRecord {
  id: string;
  timestamp: number;
  digits: DigitsCount;
  casesCount: number;
  mode: OperationMode;
  intervalSeconds: number;
  expected: number;
  userAnswer: number | null;
  isCorrect: boolean;
}

export interface UserStats {
  totalAttempts: number;
  totalCorrect: number;
  currentStreak: number;
  bestStreak: number;
  records: SessionRecord[];
}
