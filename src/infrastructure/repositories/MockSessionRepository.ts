import type { Session } from "../../domain/entities/Session";
import type { ISessionRepository } from "../../domain/repositories/ISessionRepository";
import { mockQuizStore } from "./mock/mockQuizStore";

export class MockSessionRepository implements ISessionRepository {
  async findByToken(sessionToken: string): Promise<Session | null> {
    return mockQuizStore.sessions.get(sessionToken) ?? null;
  }

  async save(session: Session): Promise<void> {
    mockQuizStore.sessions.set(session.sessionToken, session);
  }

  async updateLastSeenAt(sessionToken: string, lastSeenAt: string): Promise<void> {
    const session = await this.findByToken(sessionToken);

    if (!session) {
      return;
    }

    mockQuizStore.sessions.set(sessionToken, session.updateLastSeenAt(lastSeenAt));
  }
}
