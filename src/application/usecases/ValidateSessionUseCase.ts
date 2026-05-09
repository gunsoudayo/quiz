import type { SessionValidationDto } from "../dto/SessionDto";
import type { ISessionRepository } from "../../domain/repositories/ISessionRepository";

export interface ValidateSessionInputDto {
  readonly sessionToken: string;
}

export class ValidateSessionUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(input: ValidateSessionInputDto): Promise<SessionValidationDto> {
    const sessionToken = input.sessionToken.trim();

    if (sessionToken.length === 0) {
      return { isValid: false };
    }

    if (this.sessionRepository.validate) {
      return await this.sessionRepository.validate(sessionToken);
    }

    const session = await this.sessionRepository.findByToken(sessionToken);

    if (!session || session.isExpired()) {
      return { isValid: false };
    }

    await this.sessionRepository.updateLastSeenAt(session.sessionToken, new Date().toISOString());

    return {
      isValid: true,
      roomId: session.roomId,
      participantId: session.participantId,
      participantName: session.participantName,
      role: session.role,
      expiresAt: session.expiresAt,
    };
  }
}
