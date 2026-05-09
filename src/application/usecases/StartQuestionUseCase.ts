import type { IQuestionRepository } from "../../domain/repositories/IQuestionRepository";
import type { IRealtimeEventRepository } from "../../domain/repositories/IRealtimeEventRepository";
import type { IRoomRepository } from "../../domain/repositories/IRoomRepository";
import type { ISessionRepository } from "../../domain/repositories/ISessionRepository";
import type { ITallyRepository } from "../../domain/repositories/ITallyRepository";
import { QuestionIndex } from "../../domain/valueObjects/QuestionIndex";

export interface StartQuestionInputDto {
  readonly sessionToken: string;
  readonly roomId: string;
  readonly questionIndex: number;
}

export class StartQuestionUseCase {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly roomRepository: IRoomRepository,
    private readonly questionRepository: IQuestionRepository,
    private readonly tallyRepository: ITallyRepository,
    private readonly realtimeEventRepository: IRealtimeEventRepository,
  ) {}

  async execute(input: StartQuestionInputDto): Promise<void> {
    if (this.roomRepository.startQuestion) {
      await this.roomRepository.startQuestion(input);
      return;
    }

    const session = await this.sessionRepository.findByToken(input.sessionToken);

    if (!session || session.isExpired() || !session.isHostSession()) {
      throw new Error("進行者セッションが無効です。");
    }

    const questionIndex = new QuestionIndex(input.questionIndex);
    const room = await this.roomRepository.findById(input.roomId);
    const question = await this.questionRepository.findByIndex(questionIndex);

    if (!room) {
      throw new Error("Room was not found.");
    }
    if (!question || question.isWaitingQuestion()) {
      throw new Error("開始できる問題が見つかりません。");
    }

    const updatedRoom = room.startQuestion(questionIndex, new Date().toISOString());
    await this.roomRepository.save(updatedRoom);
    await this.tallyRepository.initialize(updatedRoom.roomId, questionIndex);
    await this.realtimeEventRepository.publishQuestionStarted(updatedRoom.roomId, questionIndex);
    await this.sessionRepository.updateLastSeenAt(session.sessionToken, new Date().toISOString());
  }
}
