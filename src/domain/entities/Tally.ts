import type { ChoiceValue } from "../valueObjects/Choice";
import { Choice } from "../valueObjects/Choice";
import { QuestionIndex } from "../valueObjects/QuestionIndex";

export interface TallyCounts {
  readonly A: number;
  readonly B: number;
  readonly C: number;
  readonly D: number;
}

export interface TallyProps {
  readonly roomId: string;
  readonly questionIndex: QuestionIndex;
  readonly counts: TallyCounts;
  readonly updatedAt: string;
}

export class Tally {
  private readonly props: TallyProps;

  constructor(props: TallyProps) {
    if (props.roomId.trim().length === 0) {
      throw new Error("Room id must not be empty.");
    }

    Object.values(props.counts).forEach((count) => {
      if (count < 0 || !Number.isInteger(count)) {
        throw new Error("Tally count must be a non-negative integer.");
      }
    });

    this.props = props;
  }

  get roomId(): string {
    return this.props.roomId;
  }

  get questionIndex(): QuestionIndex {
    return this.props.questionIndex;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }

  increment(choice: Choice, updatedAt: string): Tally {
    return new Tally({
      ...this.props,
      counts: {
        ...this.props.counts,
        [choice.value]: this.props.counts[choice.value] + 1,
      },
      updatedAt,
    });
  }

  toDisplayModel(): Record<ChoiceValue, number> {
    return { ...this.props.counts };
  }

  static empty(roomId: string, questionIndex: QuestionIndex, updatedAt: string): Tally {
    return new Tally({
      roomId,
      questionIndex,
      counts: { A: 0, B: 0, C: 0, D: 0 },
      updatedAt,
    });
  }
}
