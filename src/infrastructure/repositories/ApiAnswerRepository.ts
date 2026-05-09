import type { Answer } from "../../domain/entities/Answer";
import type { IAnswerRepository } from "../../domain/repositories/IAnswerRepository";
import type { QuestionIndex } from "../../domain/valueObjects/QuestionIndex";
import type { SubmitAnswerApiRequest, SubmitAnswerApiResponse } from "../../shared/types/api";
import { ApiClient } from "../api/ApiClient";
import { ApiClientError } from "../api/ApiClient";
import type { GetAnswerResponseDto, ListAnswersResponseDto } from "../api/dto/ApiDtos";
import { ENDPOINTS } from "../api/endpoints";
import { AnswerMapper } from "../mappers/AnswerMapper";
import { isNotFoundError } from "./api/isNotFoundError";

export class ApiAnswerRepository implements IAnswerRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async submitAnswer(input: SubmitAnswerApiRequest): Promise<SubmitAnswerApiResponse> {
    try {
      return await this.apiClient.post<SubmitAnswerApiResponse>(ENDPOINTS.answers.submit, input);
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 409) {
        throw new Error("回答済み、または回答受付中ではありません。");
      }

      throw error;
    }
  }

  async findByParticipant(roomId: string, questionIndex: QuestionIndex, participantId: string): Promise<Answer | null> {
    try {
      const response = await this.apiClient.get<GetAnswerResponseDto>(
        ENDPOINTS.answers.byParticipant(roomId, questionIndex.value, participantId),
      );
      return AnswerMapper.toEntity(response);
    } catch (error) {
      if (isNotFoundError(error)) {
        return null;
      }

      throw error;
    }
  }

  async listByQuestion(roomId: string, questionIndex: QuestionIndex): Promise<readonly Answer[]> {
    const response = await this.apiClient.get<ListAnswersResponseDto>(
      ENDPOINTS.answers.byQuestion(roomId, questionIndex.value),
    );
    return response.answers.map((answer) => AnswerMapper.toEntity(answer));
  }

  async save(answer: Answer): Promise<void> {
    await this.apiClient.put<void>(
      ENDPOINTS.answers.byParticipant(answer.roomId, answer.questionIndex.value, answer.participantId),
      AnswerMapper.toDto(answer),
    );
  }

  async saveAll(answers: readonly Answer[]): Promise<void> {
    await Promise.all(answers.map((answer) => this.save(answer)));
  }
}
