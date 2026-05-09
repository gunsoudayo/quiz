import type { SessionRole } from "../../domain/entities/Session";

export interface ParticipantSessionDto {
  readonly roomId: string;
  readonly participantId: string;
  readonly participantName: string;
  readonly role: "player";
  readonly sessionToken: string;
  readonly sessionExpiresAt: string;
}

export interface HostSessionDto {
  readonly roomId: string;
  readonly role: "host";
  readonly sessionToken: string;
  readonly sessionExpiresAt: string;
}

export interface SessionValidationDto {
  readonly isValid: boolean;
  readonly role?: SessionRole;
  readonly roomId?: string;
  readonly participantId?: string;
  readonly participantName?: string;
  readonly expiresAt?: string;
}
