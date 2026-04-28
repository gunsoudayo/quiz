import type { HostSessionDto, ParticipantSessionDto } from "../../application/dto/SessionDto";
import { LocalStorageService } from "./LocalStorageService";

const SESSION_KEYS = [
  "roomId",
  "participantId",
  "participantName",
  "role",
  "sessionToken",
  "sessionExpiresAt",
  "hostRoomId",
  "hostRole",
  "hostSessionToken",
  "hostSessionExpiresAt",
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
    this.storage.setItem("hostRoomId", session.roomId);
    this.storage.setItem("hostRole", session.role);
    this.storage.setItem("hostSessionToken", session.sessionToken);
    this.storage.setItem("hostSessionExpiresAt", session.sessionExpiresAt);
  }

  getStoredSession(): StoredSession | null {
    return this.getParticipantSession() ?? this.getHostSession();
  }

  getParticipantSession(): ParticipantSessionDto | null {
    const roomId = this.storage.getItem("roomId");
    const role = this.storage.getItem("role");
    const sessionToken = this.storage.getItem("sessionToken");
    const sessionExpiresAt = this.storage.getItem("sessionExpiresAt");
    const participantId = this.storage.getItem("participantId");
    const participantName = this.storage.getItem("participantName");

    if (role !== "player" || !roomId || !sessionToken || !sessionExpiresAt || !participantId || !participantName) {
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

  getHostSession(): HostSessionDto | null {
    const roomId = this.storage.getItem("hostRoomId") ?? this.storage.getItem("roomId");
    const role = this.storage.getItem("hostRole") ?? this.storage.getItem("role");
    const sessionToken = this.storage.getItem("hostSessionToken") ?? this.storage.getItem("sessionToken");
    const sessionExpiresAt = this.storage.getItem("hostSessionExpiresAt") ?? this.storage.getItem("sessionExpiresAt");

    if (role !== "host" || !roomId || !sessionToken || !sessionExpiresAt) {
      return null;
    }

    return {
      roomId,
      role,
      sessionToken,
      sessionExpiresAt,
    };
  }

  clearSession(): void {
    this.storage.clear(SESSION_KEYS);
  }
}
