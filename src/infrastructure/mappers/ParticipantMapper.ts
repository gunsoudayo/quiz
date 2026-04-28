import { Participant } from "../../domain/entities/Participant";
import type { ApiParticipantDto } from "../api/dto/ApiDtos";

export class ParticipantMapper {
  static toEntity(dto: ApiParticipantDto): Participant {
    return new Participant({
      roomId: dto.roomId,
      participantId: dto.participantId,
      participantName: dto.participantName,
      joinedAt: dto.joinedAt,
    });
  }

  static toDto(participant: Participant): ApiParticipantDto {
    return {
      roomId: participant.roomId,
      participantId: participant.participantId,
      participantName: participant.participantName,
      joinedAt: participant.joinedAt,
    };
  }
}
