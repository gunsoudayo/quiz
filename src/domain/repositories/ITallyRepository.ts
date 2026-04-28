import type { Tally } from "../entities/Tally";
import type { Choice } from "../valueObjects/Choice";
import type { QuestionIndex } from "../valueObjects/QuestionIndex";

export interface ITallyRepository {
  findByQuestion(roomId: string, questionIndex: QuestionIndex): Promise<Tally | null>;
  initialize(roomId: string, questionIndex: QuestionIndex): Promise<Tally>;
  increment(roomId: string, questionIndex: QuestionIndex, choice: Choice): Promise<Tally>;
}
