import { Answer } from "../../domain/entities/Answer";
import type { IAnswerRepository } from "../../domain/repositories/IAnswerRepository";
import type { IRealtimeEventRepository } from "../../domain/repositories/IRealtimeEventRepository";
import type { IRoomRepository } from "../../domain/repositories/IRoomRepository";
import type { ISessionRepository } from "../../domain/repositories/ISessionRepository";
import type { ITallyRepository } from "../../domain/repositories/ITallyRepository";
import { AnswerPolicy } from "../../domain/services/AnswerPolicy";
import type { ChoiceValue } from "../../domain/valueObjects/Choice";
import { Choice } from "../../domain/valueObjects/Choice";
import { QuestionIndex } from "../../domain/valueObjects/QuestionIndex";

export interface SubmitAnswerInputDto {
  readonly sessionToken: string;
  readonly questionIndex: number;
  readonly selectedChoice: ChoiceValue;
}

export interface SubmitAnswerOutputDto {
  readonly selectedChoice: ChoiceValue;
  readonly tally: Record<ChoiceValue, number>;
}

export class SubmitAnswerUseCase {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly roomRepository: IRoomRepository,
    private readonly answerRepository: IAnswerRepository,
    private readonly tallyRepository: ITallyRepository,
    private readonly realtimeEventRepository: IRealtimeEventRepository,
    private readonly answerPolicy: AnswerPolicy = new AnswerPolicy(),
  ) {}

  async execute(input: SubmitAnswerInputDto): Promise<SubmitAnswerOutputDto> {
    if (this.answerRepository.submitAnswer) {
      return await this.answerRepository.submitAnswer(input);
    }

    const session = await this.sessionRepository.findByToken(input.sessionToken);

    if (!session || session.isExpired() || !session.isPlayerSession()) {
      throw new Error("参加者セッションが無効です。");
    }
    if (!session.participantId || !session.participantName) {
      throw new Error("参加者情報がセッションにありません。");
    }

    const room = await this.roomRepository.findById(session.roomId);
    const questionIndex = new QuestionIndex(input.questionIndex);
    const selectedChoice = Choice.from(input.selectedChoice);

    if (!room) {
      throw new Error("Room was not found.");
    }

    const existingAnswer = await this.answerRepository.findByParticipant(
      room.roomId,
      questionIndex,
      session.participantId,
    );
    this.answerPolicy.assertCanSubmit(room, questionIndex, existingAnswer);

    const answer = new Answer({
      roomId: room.roomId,
      questionIndex,
      participantId: session.participantId,
      participantName: session.participantName,
      selectedChoice,
      answeredAt: new Date().toISOString(),
    });
    await this.answerRepository.save(answer);

    const tally = await this.tallyRepository.increment(room.roomId, questionIndex, selectedChoice);
    await this.realtimeEventRepository.publishTallyUpdated(room.roomId, tally);
    await this.sessionRepository.updateLastSeenAt(session.sessionToken, new Date().toISOString());

    return {
      selectedChoice: selectedChoice.value,
      tally: tally.toDisplayModel(),
    };
  }
}
