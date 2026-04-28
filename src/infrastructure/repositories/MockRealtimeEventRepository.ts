import type { Tally } from "../../domain/entities/Tally";
import type { IRealtimeEventRepository } from "../../domain/repositories/IRealtimeEventRepository";
import type { RankingResult } from "../../domain/services/RankingService";
import type { QuestionIndex } from "../../domain/valueObjects/QuestionIndex";
import { addMockEvent, serializeRanking } from "./mock/mockQuizStore";

export class MockRealtimeEventRepository implements IRealtimeEventRepository {
  async publishQuestionStarted(roomId: string, questionIndex: QuestionIndex): Promise<void> {
    addMockEvent("QUESTION_STARTED", roomId, { questionIndex: questionIndex.value });
  }

  async publishTallyUpdated(roomId: string, tally: Tally): Promise<void> {
    addMockEvent("TALLY_UPDATED", roomId, {
      questionIndex: tally.questionIndex.value,
      tally: tally.toDisplayModel(),
    });
  }

  async publishResultShown(roomId: string, questionIndex: QuestionIndex): Promise<void> {
    addMockEvent("RESULT_SHOWN", roomId, { questionIndex: questionIndex.value });
  }

  async publishRankingUpdated(roomId: string, ranking: readonly RankingResult[]): Promise<void> {
    addMockEvent("RANKING_UPDATED", roomId, { ranking: serializeRanking(ranking) });
  }
}
