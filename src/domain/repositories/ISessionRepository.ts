import type { Session } from "../entities/Session";
import type { HostLoginApiRequest, HostLoginApiResponse, ValidateSessionApiResponse } from "../../shared/types/api";

export interface ISessionRepository {
  loginHost?(input: HostLoginApiRequest): Promise<HostLoginApiResponse>;
  validate?(sessionToken: string): Promise<ValidateSessionApiResponse>;
  findByToken(sessionToken: string): Promise<Session | null>;
  save(session: Session): Promise<void>;
  updateLastSeenAt(sessionToken: string, lastSeenAt: string): Promise<void>;
}
