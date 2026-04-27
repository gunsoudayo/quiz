import { Choice } from "../valueObjects/Choice";
import { QuestionIndex } from "../valueObjects/QuestionIndex";

export interface QuestionChoice {
  readonly choice: Choice;
  readonly label: string;
}

export interface QuestionProps {
  readonly questionIndex: QuestionIndex;
  readonly text: string;
  readonly choices: readonly QuestionChoice[];
  readonly correctChoice: Choice;
  readonly point: number;
}

export class Question {
  private readonly props: QuestionProps;

  constructor(props: QuestionProps) {
    if (props.text.trim().length === 0) {
      throw new Error("Question text must not be empty.");
    }
    if (props.point < 0 || !Number.isInteger(props.point)) {
      throw new Error("Question point must be a non-negative integer.");
    }

    this.props = props;
  }

  get questionIndex(): QuestionIndex {
    return this.props.questionIndex;
  }

  get text(): string {
    return this.props.text;
  }

  get choices(): readonly QuestionChoice[] {
    return this.props.choices;
  }

  get correctChoice(): Choice {
    return this.props.correctChoice;
  }

  get point(): number {
    return this.props.point;
  }

  isWaitingQuestion(): boolean {
    return this.props.questionIndex.isWaiting();
  }

  isCorrectChoice(choice: Choice): boolean {
    return this.props.correctChoice.equals(choice);
  }
}
