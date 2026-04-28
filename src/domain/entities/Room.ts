import { QuestionIndex } from "../valueObjects/QuestionIndex";
import { RoomStatus } from "../valueObjects/RoomStatus";

export interface RoomProps {
  readonly roomId: string;
  readonly currentQuestionIndex: QuestionIndex;
  readonly status: RoomStatus;
  readonly updatedAt: string;
}

export class Room {
  private readonly props: RoomProps;

  constructor(props: RoomProps) {
    if (props.roomId.trim().length === 0) {
      throw new Error("Room id must not be empty.");
    }

    this.props = props;
  }

  get roomId(): string {
    return this.props.roomId;
  }

  get currentQuestionIndex(): QuestionIndex {
    return this.props.currentQuestionIndex;
  }

  get status(): RoomStatus {
    return this.props.status;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }

  isWaiting(): boolean {
    return this.props.status.isWaiting();
  }

  isOpen(): boolean {
    return this.props.status.isOpen();
  }

  isResult(): boolean {
    return this.props.status.isResult();
  }

  canAcceptAnswer(questionIndex: QuestionIndex): boolean {
    return this.isOpen() && !questionIndex.isWaiting() && this.props.currentQuestionIndex.equals(questionIndex);
  }

  startQuestion(questionIndex: QuestionIndex, updatedAt: string): Room {
    if (questionIndex.isWaiting()) {
      throw new Error("Waiting question cannot be started.");
    }

    return new Room({
      ...this.props,
      currentQuestionIndex: questionIndex,
      status: RoomStatus.open(),
      updatedAt,
    });
  }

  showResult(updatedAt: string): Room {
    if (this.props.currentQuestionIndex.isWaiting()) {
      throw new Error("Cannot show result before starting a question.");
    }

    return new Room({
      ...this.props,
      status: RoomStatus.result(),
      updatedAt,
    });
  }
}
