export type ExerciseType = 'translation' | 'fillInBlank';

export interface Exercise {
  itemId: bigint;
  type: ExerciseType;
  prompt: string;
  expectedAnswer: string;
  context?: string;
}

export interface PracticeResult {
  itemId: bigint;
  passed: boolean;
  userAnswer: string;
}
