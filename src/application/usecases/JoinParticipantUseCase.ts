import type { ParticipantSessionDto } from "../dto/SessionDto";
import { Participant } from "../../domain/entities/Participant";
import { Session } from "../../domain/entities/Session";
import type { IParticipantRepository } from "../../domain/repositories/IParticipantRepository";
import type { ISessionRepository } from "../../domain/repositories/ISessionRepository";

export interface JoinParticipantInputDto {
  readonly participantName: string;
  readonly password: string;
}

export class JoinParticipantUseCase {
  constructor(
    private readonly participantRepository: IParticipantRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly roomId = "room-001",
  ) {}

  async execute(input: JoinParticipantInputDto): Promise<ParticipantSessionDto> {
    const participantName = input.participantName.trim();

    if (participantName.length === 0) {
      throw new Error("Please enter a participant name.");
    }
    if (input.password.trim().length === 0) {
      throw new Error("Please enter the join password.");
    }

    if (this.participantRepository.joinParticipant) {
      return await this.participantRepository.joinParticipant({
        roomId: this.roomId,
        participantName,
        password: input.password,
      });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    const suffix = this.createRandomSuffix();
    const participantId = `p_${suffix}`;
    const sessionToken = `sess_${suffix}`;

    await this.participantRepository.save(
      new Participant({
        roomId: this.roomId,
        participantId,
        participantName,
        joinedAt: now.toISOString(),
      }),
    );
    await this.sessionRepository.save(
      new Session({
        sessionToken,
        roomId: this.roomId,
        participantId,
        participantName,
        role: "player",
        expiresAt: expiresAt.toISOString(),
        createdAt: now.toISOString(),
        lastSeenAt: now.toISOString(),
      }),
    );

    return {
      roomId: this.roomId,
      participantId,
      participantName,
      role: "player",
      sessionToken,
      sessionExpiresAt: expiresAt.toISOString(),
    };
  }

  private createRandomSuffix(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID().replaceAll("-", "").slice(0, 8);
    }

    return Math.random().toString(16).slice(2, 10);
  }
}
