import type { Question } from "../../domain/entities/Question";
import type { IQuestionRepository } from "../../domain/repositories/IQuestionRepository";
import type { QuestionIndex } from "../../domain/valueObjects/QuestionIndex";
import { ApiClient } from "../api/ApiClient";
import type { GetQuestionResponseDto, ListQuestionsResponseDto } from "../api/dto/ApiDtos";
import { ENDPOINTS } from "../api/endpoints";
import { QuestionMapper } from "../mappers/QuestionMapper";
import { isNotFoundError } from "./api/isNotFoundError";

export class ApiQuestionRepository implements IQuestionRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async findAll(): Promise<readonly Question[]> {
    const response = await this.apiClient.get<ListQuestionsResponseDto>(ENDPOINTS.questions.list);
    return response.questions.map((question) => QuestionMapper.toEntity(question));
  }

  async findByIndex(questionIndex: QuestionIndex): Promise<Question | null> {
    try {
      const response = await this.apiClient.get<GetQuestionResponseDto>(
        ENDPOINTS.questions.byIndex(questionIndex.value),
      );
      return QuestionMapper.toEntity(response);
    } catch (error) {
      if (isNotFoundError(error)) {
        return null;
      }

      throw error;
    }
  }
}
