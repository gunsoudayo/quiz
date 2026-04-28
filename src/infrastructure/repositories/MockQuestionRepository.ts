import type { Question } from "../../domain/entities/Question";
import type { IQuestionRepository } from "../../domain/repositories/IQuestionRepository";
import type { QuestionIndex } from "../../domain/valueObjects/QuestionIndex";
import { mockQuizStore } from "./mock/mockQuizStore";

export class MockQuestionRepository implements IQuestionRepository {
  async findAll(): Promise<readonly Question[]> {
    return [...mockQuizStore.questions.values()];
  }

  async findByIndex(questionIndex: QuestionIndex): Promise<Question | null> {
    return mockQuizStore.questions.get(questionIndex.value) ?? null;
  }
}
