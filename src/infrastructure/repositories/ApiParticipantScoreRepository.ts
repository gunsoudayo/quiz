import type { ParticipantScore } from "../../domain/entities/ParticipantScore";
import type { RankingItemDto } from "../../application/dto/RoomStateDto";
import type { IParticipantScoreRepository } from "../../domain/repositories/IParticipantScoreRepository";
import type { RankingApiResponse, RoomStateApiRankingItem } from "../../shared/types/api";
import { ApiClient } from "../api/ApiClient";
import type {
  GetParticipantScoreResponseDto,
  ListParticipantScoresResponseDto,
} from "../api/dto/ApiDtos";
import { ENDPOINTS } from "../api/endpoints";
import { ParticipantScoreMapper } from "../mappers/ParticipantScoreMapper";
import { isNotFoundError } from "./api/isNotFoundError";

export class ApiParticipantScoreRepository implements IParticipantScoreRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async listRanking(roomId: string): Promise<readonly RankingItemDto[]> {
    const response = await this.apiClient.get<RankingApiResponse>(ENDPOINTS.ranking.byRoom(roomId));
    const ranking: readonly RoomStateApiRankingItem[] = "ranking" in response ? response.ranking : response;

    return ranking.map((item) => ({
      rank: item.rank,
      participantName: item.participantName,
      correctCount: item.correctCount,
      totalScore: item.totalScore,
    }));
  }

  async findByParticipant(roomId: string, participantId: string): Promise<ParticipantScore | null> {
    try {
      const response = await this.apiClient.get<GetParticipantScoreResponseDto>(
        ENDPOINTS.participantScores.byParticipant(roomId, participantId),
      );
      return ParticipantScoreMapper.toEntity(response);
    } catch (error) {
      if (isNotFoundError(error)) {
        return null;
      }

      throw error;
    }
  }

  async listByRoom(roomId: string): Promise<readonly ParticipantScore[]> {
    const response = await this.apiClient.get<ListParticipantScoresResponseDto>(
      ENDPOINTS.participantScores.byRoom(roomId),
    );
    return response.participantScores.map((score) => ParticipantScoreMapper.toEntity(score));
  }

  async save(score: ParticipantScore): Promise<void> {
    await this.apiClient.put<void>(
      ENDPOINTS.participantScores.byParticipant(score.roomId, score.participantId),
      ParticipantScoreMapper.toDto(score),
    );
  }
}
