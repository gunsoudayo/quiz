export type SessionRole = "player" | "host";

export interface SessionProps {
  readonly sessionToken: string;
  readonly roomId: string;
  readonly role: SessionRole;
  readonly expiresAt: string;
  readonly createdAt: string;
  readonly lastSeenAt: string;
  readonly participantId?: string;
  readonly participantName?: string;
}

export class Session {
  private readonly props: SessionProps;

  constructor(props: SessionProps) {
    if (props.sessionToken.trim().length === 0) {
      throw new Error("Session token must not be empty.");
    }
    if (props.roomId.trim().length === 0) {
      throw new Error("Room id must not be empty.");
    }

    this.props = props;
  }

  get sessionToken(): string {
    return this.props.sessionToken;
  }

  get roomId(): string {
    return this.props.roomId;
  }

  get role(): SessionRole {
    return this.props.role;
  }

  get expiresAt(): string {
    return this.props.expiresAt;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get lastSeenAt(): string {
    return this.props.lastSeenAt;
  }

  get participantId(): string | undefined {
    return this.props.participantId;
  }

  get participantName(): string | undefined {
    return this.props.participantName;
  }

  isExpired(now: Date = new Date()): boolean {
    return new Date(this.props.expiresAt).getTime() <= now.getTime();
  }

  isPlayerSession(): boolean {
    return this.props.role === "player";
  }

  isHostSession(): boolean {
    return this.props.role === "host";
  }

  updateLastSeenAt(lastSeenAt: string): Session {
    return new Session({
      ...this.props,
      lastSeenAt,
    });
  }
}
