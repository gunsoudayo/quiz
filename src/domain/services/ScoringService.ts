import type { Answer } from "../entities/Answer";
import type { Question } from "../entities/Question";

export interface ScoringResult {
  readonly isCorrect: boolean;
  readonly awardedPoints: number;
}

export class ScoringService {
  score(question: Question, answer: Answer): ScoringResult {
    const isCorrect = question.isCorrectChoice(answer.selectedChoice);

    return {
      isCorrect,
      awardedPoints: isCorrect ? question.point : 0,
    };
  }
}
