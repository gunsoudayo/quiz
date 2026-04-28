import type { Question } from "../entities/Question";
import type { QuestionIndex } from "../valueObjects/QuestionIndex";

export interface IQuestionRepository {
  findAll(): Promise<readonly Question[]>;
  findByIndex(questionIndex: QuestionIndex): Promise<Question | null>;
}
