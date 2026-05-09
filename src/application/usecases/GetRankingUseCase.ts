import type { RankingItemDto } from "../dto/RoomStateDto";
import type { IParticipantScoreRepository } from "../../domain/repositories/IParticipantScoreRepository";
import { RankingService } from "../../domain/services/RankingService";

export interface GetRankingInputDto {
  readonly roomId: string;
}

export class GetRankingUseCase {
  constructor(
    private readonly participantScoreRepository: IParticipantScoreRepository,
    private readonly rankingService: RankingService = new RankingService(),
  ) {}

  async execute(input: GetRankingInputDto): Promise<readonly RankingItemDto[]> {
    if (this.participantScoreRepository.listRanking) {
      return await this.participantScoreRepository.listRanking(input.roomId);
    }

    const scores = await this.participantScoreRepository.listByRoom(input.roomId);

    return this.rankingService.buildRanking(scores).map((item) => ({
      rank: item.rank,
      participantName: item.participantName,
      correctCount: item.correctCount,
      totalScore: item.totalScore,
    }));
  }
}
