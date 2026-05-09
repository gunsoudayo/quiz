import type { RoomStateDto } from "../dto/RoomStateDto";
import type { IAnswerRepository } from "../../domain/repositories/IAnswerRepository";
import type { IParticipantScoreRepository } from "../../domain/repositories/IParticipantScoreRepository";
import type { IQuestionRepository } from "../../domain/repositories/IQuestionRepository";
import type { IRoomRepository } from "../../domain/repositories/IRoomRepository";
import type { ITallyRepository } from "../../domain/repositories/ITallyRepository";
import { RankingService } from "../../domain/services/RankingService";
import { Tally } from "../../domain/entities/Tally";
import type { RoomStateApiResponse } from "../../shared/types/api";

export interface GetRoomStateInputDto {
  readonly roomId?: string;
  readonly participantId?: string;
}

export class GetRoomStateUseCase {
  constructor(
    private readonly roomRepository: IRoomRepository,
    private readonly questionRepository: IQuestionRepository,
    private readonly tallyRepository: ITallyRepository,
    private readonly participantScoreRepository: IParticipantScoreRepository,
    private readonly answerRepository: IAnswerRepository,
    private readonly rankingService: RankingService = new RankingService(),
  ) {}

  async execute(input: GetRoomStateInputDto = {}): Promise<RoomStateDto> {
    const roomId = input.roomId ?? "room-001";

    if (this.roomRepository.findState) {
      const apiRoomState = await this.roomRepository.findState(roomId, input.participantId);

      if (!apiRoomState) {
        throw new Error("Room was not found.");
      }

      return this.toRoomStateDto(apiRoomState);
    }

    const room = await this.roomRepository.findById(roomId);

    if (!room) {
      throw new Error("Room was not found.");
    }

    const question = await this.questionRepository.findByIndex(room.currentQuestionIndex);

    if (!question) {
      throw new Error("Question was not found.");
    }

    const tally =
      (await this.tallyRepository.findByQuestion(room.roomId, room.currentQuestionIndex)) ??
      Tally.empty(room.roomId, room.currentQuestionIndex, new Date().toISOString());
    const ranking = this.rankingService.buildRanking(await this.participantScoreRepository.listByRoom(room.roomId));
    const currentParticipantAnswer = input.participantId
      ? await this.answerRepository.findByParticipant(room.roomId, room.currentQuestionIndex, input.participantId)
      : null;

    return {
      roomId: room.roomId,
      currentQuestionIndex: room.currentQuestionIndex.value,
      status: room.status.value,
      question: {
        questionIndex: question.questionIndex.value,
        text: question.text,
        choices: question.choices.map((item) => ({
          key: item.choice.value,
          label: item.label,
        })),
        correctChoice: question.correctChoice?.value,
        point: question.point,
      },
      tally: tally.toDisplayModel(),
      ranking: ranking.map((item) => ({
        rank: item.rank,
        participantName: item.participantName,
        correctCount: item.correctCount,
        totalScore: item.totalScore,
      })),
      currentParticipantAnswer: currentParticipantAnswer?.selectedChoice.value,
    };
  }

  private toRoomStateDto(response: RoomStateApiResponse): RoomStateDto {
    return {
      roomId: response.roomId,
      currentQuestionIndex: response.currentQuestionIndex,
      status: response.status,
      question: {
        questionIndex: response.question.questionIndex,
        text: response.question.text,
        choices: response.question.choices.map((item) => ({
          key: item.key,
          label: item.label,
        })),
        correctChoice: response.question.correctChoice,
        point: response.question.point,
      },
      tally: {
        A: response.tally.A,
        B: response.tally.B,
        C: response.tally.C,
        D: response.tally.D,
      },
      ranking: response.ranking.map((item) => ({
        rank: item.rank,
        participantName: item.participantName,
        correctCount: item.correctCount,
        totalScore: item.totalScore,
      })),
      currentParticipantAnswer: response.currentParticipantAnswer,
    };
  }
}
