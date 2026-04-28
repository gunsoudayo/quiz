import type { Tally } from "../../domain/entities/Tally";
import type { ITallyRepository } from "../../domain/repositories/ITallyRepository";
import type { Choice } from "../../domain/valueObjects/Choice";
import type { QuestionIndex } from "../../domain/valueObjects/QuestionIndex";
import { ApiClient } from "../api/ApiClient";
import type { GetTallyResponseDto, SaveTallyResponseDto } from "../api/dto/ApiDtos";
import { ENDPOINTS } from "../api/endpoints";
import { TallyMapper } from "../mappers/TallyMapper";
import { isNotFoundError } from "./api/isNotFoundError";
import { Tally as TallyEntity } from "../../domain/entities/Tally";

export class ApiTallyRepository implements ITallyRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async findByQuestion(roomId: string, questionIndex: QuestionIndex): Promise<Tally | null> {
    try {
      const response = await this.apiClient.get<GetTallyResponseDto>(
        ENDPOINTS.tallies.byQuestion(roomId, questionIndex.value),
      );
      return TallyMapper.toEntity(response);
    } catch (error) {
      if (isNotFoundError(error)) {
        return null;
      }

      throw error;
    }
  }

  async initialize(roomId: string, questionIndex: QuestionIndex): Promise<Tally> {
    const tally = TallyEntity.empty(roomId, questionIndex, new Date().toISOString());
    const response = await this.apiClient.put<SaveTallyResponseDto>(
      ENDPOINTS.tallies.byQuestion(roomId, questionIndex.value),
      TallyMapper.toDto(tally),
    );
    return TallyMapper.toEntity(response);
  }

  async increment(roomId: string, questionIndex: QuestionIndex, choice: Choice): Promise<Tally> {
    const response = await this.apiClient.post<SaveTallyResponseDto>(
      ENDPOINTS.tallies.increment(roomId, questionIndex.value),
      { selectedChoice: choice.value },
    );
    return TallyMapper.toEntity(response);
  }
}
