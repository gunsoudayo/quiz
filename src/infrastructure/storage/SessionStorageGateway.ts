import type { HostSessionDto, ParticipantSessionDto } from "../../application/dto/SessionDto";
import { LocalStorageService } from "./LocalStorageService";

const SESSION_KEYS = [
  "roomId",
  "participantId",
  "participantName",
  "role",
  "sessionToken",
  "sessionExpiresAt",
] as const;

export type StoredSession = ParticipantSessionDto | HostSessionDto;

export class SessionStorageGateway {
  constructor(private readonly storage: LocalStorageService = new LocalStorageService()) {}

  saveParticipantSession(session: ParticipantSessionDto): void {
    this.storage.setItem("roomId", session.roomId);
    this.storage.setItem("participantId", session.participantId);
    this.storage.setItem("participantName", session.participantName);
    this.storage.setItem("role", session.role);
    this.storage.setItem("sessionToken", session.sessionToken);
    this.storage.setItem("sessionExpiresAt", session.sessionExpiresAt);
  }

  saveHostSession(session: HostSessionDto): void {
    this.storage.setItem("roomId", session.roomId);
    this.storage.removeItem("participantId");
    this.storage.removeItem("participantName");
    this.storage.setItem("role", session.role);
    this.storage.setItem("sessionToken", session.sessionToken);
    this.storage.setItem("sessionExpiresAt", session.sessionExpiresAt);
  }

  getStoredSession(): StoredSession | null {
    const roomId = this.storage.getItem("roomId");
    const role = this.storage.getItem("role");
    const sessionToken = this.storage.getItem("sessionToken");
    const sessionExpiresAt = this.storage.getItem("sessionExpiresAt");

    if (!roomId || !role || !sessionToken || !sessionExpiresAt) {
      return null;
    }

    if (role === "host") {
      return {
        roomId,
        role,
        sessionToken,
        sessionExpiresAt,
      };
    }

    if (role === "player") {
      const participantId = this.storage.getItem("participantId");
      const participantName = this.storage.getItem("participantName");

      if (!participantId || !participantName) {
        return null;
      }

      return {
        roomId,
        participantId,
        participantName,
        role,
        sessionToken,
        sessionExpiresAt,
      };
    }

    return null;
  }

  clearSession(): void {
    this.storage.clear(SESSION_KEYS);
  }
}
