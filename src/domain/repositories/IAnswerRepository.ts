import type { Answer } from "../entities/Answer";
import type { SubmitAnswerApiRequest, SubmitAnswerApiResponse } from "../../shared/types/api";
import type { QuestionIndex } from "../valueObjects/QuestionIndex";

export interface IAnswerRepository {
  submitAnswer?(input: SubmitAnswerApiRequest): Promise<SubmitAnswerApiResponse>;
  findByParticipant(roomId: string, questionIndex: QuestionIndex, participantId: string): Promise<Answer | null>;
  listByQuestion(roomId: string, questionIndex: QuestionIndex): Promise<readonly Answer[]>;
  save(answer: Answer): Promise<void>;
  saveAll(answers: readonly Answer[]): Promise<void>;
}
