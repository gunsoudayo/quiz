import type { HostSessionDto } from "../dto/SessionDto";
import { Session } from "../../domain/entities/Session";
import type { ISessionRepository } from "../../domain/repositories/ISessionRepository";

export interface LoginHostInputDto {
  readonly adminPassword: string;
}

export class LoginHostUseCase {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly roomId = "room-001",
  ) {}

  async execute(input: LoginHostInputDto): Promise<HostSessionDto> {
    // TODO: バックエンド API で管理用パスワード検証を行う。
    if (input.adminPassword.trim().length === 0) {
      throw new Error("管理用パスワードを入力してください。");
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const suffix = this.createRandomSuffix();
    const sessionToken = `sess_host_${suffix}`;

    await this.sessionRepository.save(
      new Session({
        sessionToken,
        roomId: this.roomId,
        role: "host",
        expiresAt: expiresAt.toISOString(),
        createdAt: now.toISOString(),
        lastSeenAt: now.toISOString(),
      }),
    );

    return {
      roomId: this.roomId,
      role: "host",
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
