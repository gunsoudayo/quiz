import type { HostSessionDto } from "../dto/SessionDto";

export interface LoginHostInputDto {
  readonly adminPassword: string;
}

export class LoginHostUseCase {
  execute(_input: LoginHostInputDto): HostSessionDto {
    // TODO: バックエンド API で管理用パスワード検証、sessions 作成を行う。
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const suffix = this.createRandomSuffix();

    return {
      roomId: "room-001",
      role: "host",
      sessionToken: `sess_host_${suffix}`,
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
