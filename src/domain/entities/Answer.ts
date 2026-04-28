import { Choice } from "../valueObjects/Choice";
import { QuestionIndex } from "../valueObjects/QuestionIndex";

export interface AnswerProps {
  readonly roomId: string;
  readonly questionIndex: QuestionIndex;
  readonly participantId: string;
  readonly participantName: string;
  readonly selectedChoice: Choice;
  readonly answeredAt: string;
  readonly isCorrect?: boolean;
  readonly awardedPoints?: number;
}

export class Answer {
  private readonly props: AnswerProps;

  constructor(props: AnswerProps) {
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

  get questionIndex(): QuestionIndex {
    return this.props.questionIndex;
  }

  get participantId(): string {
    return this.props.participantId;
  }

  get participantName(): string {
    return this.props.participantName;
  }

  get selectedChoice(): Choice {
    return this.props.selectedChoice;
  }

  get answeredAt(): string {
    return this.props.answeredAt;
  }

  get isCorrect(): boolean | undefined {
    return this.props.isCorrect;
  }

  get awardedPoints(): number | undefined {
    return this.props.awardedPoints;
  }

  isScored(): boolean {
    return this.props.isCorrect !== undefined && this.props.awardedPoints !== undefined;
  }

  markScored(isCorrect: boolean, awardedPoints: number): Answer {
    if (awardedPoints < 0 || !Number.isInteger(awardedPoints)) {
      throw new Error("Awarded points must be a non-negative integer.");
    }

    return new Answer({
      ...this.props,
      isCorrect,
      awardedPoints,
    });
  }
}
