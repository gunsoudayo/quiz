import type { Session } from "../entities/Session";

export interface ISessionRepository {
  findByToken(sessionToken: string): Promise<Session | null>;
  save(session: Session): Promise<void>;
  updateLastSeenAt(sessionToken: string, lastSeenAt: string): Promise<void>;
}
