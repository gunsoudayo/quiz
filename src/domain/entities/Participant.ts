export interface ParticipantProps {
  readonly roomId: string;
  readonly participantId: string;
  readonly participantName: string;
  readonly joinedAt: string;
}

export class Participant {
  private readonly props: ParticipantProps;

  constructor(props: ParticipantProps) {
    if (props.roomId.trim().length === 0) {
      throw new Error("Room id must not be empty.");
    }
    if (props.participantId.trim().length === 0) {
      throw new Error("Participant id must not be empty.");
    }
    if (props.participantName.trim().length === 0) {
      throw new Error("Participant name must not be empty.");
    }

    this.props = props;
  }

  get roomId(): string {
    return this.props.roomId;
  }

  get participantId(): string {
    return this.props.participantId;
  }

  get participantName(): string {
    return this.props.participantName;
  }

  get joinedAt(): string {
    return this.props.joinedAt;
  }
}
