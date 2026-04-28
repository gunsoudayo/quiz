import type { Tally } from "../entities/Tally";
import type { RankingResult } from "../services/RankingService";
import type { QuestionIndex } from "../valueObjects/QuestionIndex";

export interface IRealtimeEventRepository {
  publishQuestionStarted(roomId: string, questionIndex: QuestionIndex): Promise<void>;
  publishTallyUpdated(roomId: string, tally: Tally): Promise<void>;
  publishResultShown(roomId: string, questionIndex: QuestionIndex): Promise<void>;
  publishRankingUpdated(roomId: string, ranking: readonly RankingResult[]): Promise<void>;
}
