import { Session } from "../../domain/entities/Session";
import type { ApiSessionDto } from "../api/dto/ApiDtos";

export class SessionMapper {
  static toEntity(dto: ApiSessionDto): Session {
    return new Session({
      sessionToken: dto.sessionToken,
      roomId: dto.roomId,
      participantId: dto.participantId,
      participantName: dto.participantName,
      role: dto.role,
      expiresAt: dto.expiresAt,
      createdAt: dto.createdAt,
      lastSeenAt: dto.lastSeenAt,
    });
  }

  static toDto(session: Session): ApiSessionDto {
    return {
      sessionToken: session.sessionToken,
      roomId: session.roomId,
      participantId: session.participantId,
      participantName: session.participantName,
      role: session.role,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      lastSeenAt: session.lastSeenAt,
    };
  }
}
