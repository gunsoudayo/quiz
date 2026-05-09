import type { Participant } from "../../domain/entities/Participant";
import type { IParticipantRepository } from "../../domain/repositories/IParticipantRepository";
import type { JoinParticipantApiRequest, JoinParticipantApiResponse } from "../../shared/types/api";
import { ApiClient } from "../api/ApiClient";
import type {
  GetParticipantResponseDto,
  ListParticipantsResponseDto,
} from "../api/dto/ApiDtos";
import { ENDPOINTS } from "../api/endpoints";
import { ParticipantMapper } from "../mappers/ParticipantMapper";
import { isNotFoundError } from "./api/isNotFoundError";

export class ApiParticipantRepository implements IParticipantRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async joinParticipant(input: JoinParticipantApiRequest): Promise<JoinParticipantApiResponse> {
    return await this.apiClient.post<JoinParticipantApiResponse>(ENDPOINTS.participants.join, input);
  }

  async findById(roomId: string, participantId: string): Promise<Participant | null> {
    try {
      const response = await this.apiClient.get<GetParticipantResponseDto>(
        ENDPOINTS.participants.byId(roomId, participantId),
      );
      return ParticipantMapper.toEntity(response);
    } catch (error) {
      if (isNotFoundError(error)) {
        return null;
      }

      throw error;
    }
  }

  async listByRoom(roomId: string): Promise<readonly Participant[]> {
    const response = await this.apiClient.get<ListParticipantsResponseDto>(ENDPOINTS.participants.byRoom(roomId));
    return response.participants.map((participant) => ParticipantMapper.toEntity(participant));
  }

  async save(participant: Participant): Promise<void> {
    await this.apiClient.put<void>(
      ENDPOINTS.participants.byId(participant.roomId, participant.participantId),
      ParticipantMapper.toDto(participant),
    );
  }
}
