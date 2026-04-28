import { ParticipantScore } from "../../domain/entities/ParticipantScore";
import type { Answer } from "../../domain/entities/Answer";
import type { RankingItemDto } from "../dto/RoomStateDto";
import type { IAnswerRepository } from "../../domain/repositories/IAnswerRepository";
import type { IParticipantScoreRepository } from "../../domain/repositories/IParticipantScoreRepository";
import type { IQuestionRepository } from "../../domain/repositories/IQuestionRepository";
import type { IRealtimeEventRepository } from "../../domain/repositories/IRealtimeEventRepository";
import type { IRoomRepository } from "../../domain/repositories/IRoomRepository";
import type { ISessionRepository } from "../../domain/repositories/ISessionRepository";
import { RankingService } from "../../domain/services/RankingService";
import { ScoringService } from "../../domain/services/ScoringService";

export interface ShowResultInputDto {
  readonly sessionToken: string;
  readonly roomId: string;
}

export class ShowResultUseCase {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly roomRepository: IRoomRepository,
    private readonly questionRepository: IQuestionRepository,
    private readonly answerRepository: IAnswerRepository,
    private readonly participantScoreRepository: IParticipantScoreRepository,
    private readonly realtimeEventRepository: IRealtimeEventRepository,
    private readonly scoringService: ScoringService = new ScoringService(),
    private readonly rankingService: RankingService = new RankingService(),
  ) {}

  async execute(input: ShowResultInputDto): Promise<readonly RankingItemDto[]> {
    const session = await this.sessionRepository.findByToken(input.sessionToken);

    if (!session || session.isExpired() || !session.isHostSession()) {
      throw new Error("進行者セッションが無効です。");
    }

    const room = await this.roomRepository.findById(input.roomId);

    if (!room) {
      throw new Error("Room was not found.");
    }
    if (room.currentQuestionIndex.isWaiting()) {
      throw new Error("問題開始前は正解を表示できません。");
    }

    const question = await this.questionRepository.findByIndex(room.currentQuestionIndex);

    if (!question) {
      throw new Error("Question was not found.");
    }

    const now = new Date().toISOString();
    const answers = await this.answerRepository.listByQuestion(room.roomId, room.currentQuestionIndex);
    const scoredAnswers: Answer[] = [];

    for (const answer of answers) {
      if (answer.isScored()) {
        scoredAnswers.push(answer);
        continue;
      }

      const scoringResult = this.scoringService.score(question, answer);
      const scoredAnswer = answer.markScored(scoringResult.isCorrect, scoringResult.awardedPoints);
      const currentScore =
        (await this.participantScoreRepository.findByParticipant(answer.roomId, answer.participantId)) ??
        new ParticipantScore({
          roomId: answer.roomId,
          participantId: answer.participantId,
          participantName: answer.participantName,
          correctCount: 0,
          totalScore: 0,
          updatedAt: now,
        });

      await this.participantScoreRepository.save(
        currentScore.applyScoringResult(scoringResult.isCorrect, scoringResult.awardedPoints, now),
      );

      scoredAnswers.push(scoredAnswer);
    }

    await this.answerRepository.saveAll(scoredAnswers);
    await this.roomRepository.save(room.showResult(now));

    const ranking = this.rankingService.buildRanking(await this.participantScoreRepository.listByRoom(room.roomId));
    await this.realtimeEventRepository.publishResultShown(room.roomId, room.currentQuestionIndex);
    await this.realtimeEventRepository.publishRankingUpdated(room.roomId, ranking);
    await this.sessionRepository.updateLastSeenAt(session.sessionToken, now);

    return ranking.map((item) => ({
      rank: item.rank,
      participantName: item.participantName,
      correctCount: item.correctCount,
      totalScore: item.totalScore,
    }));
  }
}
