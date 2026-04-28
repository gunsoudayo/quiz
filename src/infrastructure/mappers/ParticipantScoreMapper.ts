import { ParticipantScore } from "../../domain/entities/ParticipantScore";
import type { ApiParticipantScoreDto } from "../api/dto/ApiDtos";

export class ParticipantScoreMapper {
  static toEntity(dto: ApiParticipantScoreDto): ParticipantScore {
    return new ParticipantScore({
      roomId: dto.roomId,
      participantId: dto.participantId,
      participantName: dto.participantName,
      correctCount: dto.correctCount,
      totalScore: dto.totalScore,
      updatedAt: dto.updatedAt,
    });
  }

  static toDto(score: ParticipantScore): ApiParticipantScoreDto {
    return {
      roomId: score.roomId,
      participantId: score.participantId,
      participantName: score.participantName,
      correctCount: score.correctCount,
      totalScore: score.totalScore,
      updatedAt: score.updatedAt,
    };
  }
}
