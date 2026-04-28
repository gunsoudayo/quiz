import type { Tally } from "../../domain/entities/Tally";
import type { IRealtimeEventRepository } from "../../domain/repositories/IRealtimeEventRepository";
import type { RankingResult } from "../../domain/services/RankingService";
import type { QuestionIndex } from "../../domain/valueObjects/QuestionIndex";

export class NoopRealtimeEventRepository implements IRealtimeEventRepository {
  async publishQuestionStarted(_roomId: string, _questionIndex: QuestionIndex): Promise<void> {
    // TODO: AppSync Events 実装時に publish へ差し替える。
  }

  async publishTallyUpdated(_roomId: string, _tally: Tally): Promise<void> {
    // TODO: AppSync Events 実装時に publish へ差し替える。
  }

  async publishResultShown(_roomId: string, _questionIndex: QuestionIndex): Promise<void> {
    // TODO: AppSync Events 実装時に publish へ差し替える。
  }

  async publishRankingUpdated(_roomId: string, _ranking: readonly RankingResult[]): Promise<void> {
    // TODO: AppSync Events 実装時に publish へ差し替える。
  }
}
