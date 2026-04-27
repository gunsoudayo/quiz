import type { ParticipantSessionDto } from "../dto/SessionDto";

export interface JoinParticipantInputDto {
  readonly participantName: string;
  readonly joinPassword: string;
}

export class JoinParticipantUseCase {
  execute(input: JoinParticipantInputDto): ParticipantSessionDto {
    // TODO: バックエンド API で参加用パスワード検証、participants 作成、sessions 作成を行う。
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    const suffix = this.createRandomSuffix();

    return {
      roomId: "room-001",
      participantId: `p_${suffix}`,
      participantName: input.participantName.trim(),
      role: "player",
      sessionToken: `sess_${suffix}`,
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
