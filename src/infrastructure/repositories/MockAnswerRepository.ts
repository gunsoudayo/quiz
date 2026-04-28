import type { IAnswerRepository } from "../../domain/repositories/IAnswerRepository";
import type { Answer } from "../../domain/entities/Answer";
import type { QuestionIndex } from "../../domain/valueObjects/QuestionIndex";
import { buildAnswerKey, mockQuizStore } from "./mock/mockQuizStore";

export class MockAnswerRepository implements IAnswerRepository {
  async findByParticipant(roomId: string, questionIndex: QuestionIndex, participantId: string): Promise<Answer | null> {
    return mockQuizStore.answers.get(buildAnswerKey(roomId, questionIndex, participantId)) ?? null;
  }

  async listByQuestion(roomId: string, questionIndex: QuestionIndex): Promise<readonly Answer[]> {
    return [...mockQuizStore.answers.values()].filter(
      (answer) => answer.roomId === roomId && answer.questionIndex.equals(questionIndex),
    );
  }

  async save(answer: Answer): Promise<void> {
    mockQuizStore.answers.set(buildAnswerKey(answer.roomId, answer.questionIndex, answer.participantId), answer);
  }

  async saveAll(answers: readonly Answer[]): Promise<void> {
    answers.forEach((answer) => {
      mockQuizStore.answers.set(buildAnswerKey(answer.roomId, answer.questionIndex, answer.participantId), answer);
    });
  }
}
