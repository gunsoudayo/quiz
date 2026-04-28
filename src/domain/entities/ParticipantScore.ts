export interface ParticipantScoreProps {
  readonly roomId: string;
  readonly participantId: string;
  readonly participantName: string;
  readonly correctCount: number;
  readonly totalScore: number;
  readonly updatedAt: string;
}

export class ParticipantScore {
  private readonly props: ParticipantScoreProps;

  constructor(props: ParticipantScoreProps) {
    if (props.roomId.trim().length === 0) {
      throw new Error("Room id must not be empty.");
    }
    if (props.participantId.trim().length === 0) {
      throw new Error("Participant id must not be empty.");
    }
    if (props.participantName.trim().length === 0) {
      throw new Error("Participant name must not be empty.");
    }
    if (props.correctCount < 0 || !Number.isInteger(props.correctCount)) {
      throw new Error("Correct count must be a non-negative integer.");
    }
    if (props.totalScore < 0 || !Number.isInteger(props.totalScore)) {
      throw new Error("Total score must be a non-negative integer.");
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

  get correctCount(): number {
    return this.props.correctCount;
  }

  get totalScore(): number {
    return this.props.totalScore;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }

  applyScoringResult(isCorrect: boolean, awardedPoints: number, updatedAt: string): ParticipantScore {
    return new ParticipantScore({
      ...this.props,
      correctCount: this.props.correctCount + (isCorrect ? 1 : 0),
      totalScore: this.props.totalScore + awardedPoints,
      updatedAt,
    });
  }
}
