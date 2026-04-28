import type { Tally } from "../../domain/entities/Tally";
import type { ITallyRepository } from "../../domain/repositories/ITallyRepository";
import type { Choice } from "../../domain/valueObjects/Choice";
import type { QuestionIndex } from "../../domain/valueObjects/QuestionIndex";
import { buildTallyKey, mockQuizStore } from "./mock/mockQuizStore";
import { Tally as TallyEntity } from "../../domain/entities/Tally";

export class MockTallyRepository implements ITallyRepository {
  async findByQuestion(roomId: string, questionIndex: QuestionIndex): Promise<Tally | null> {
    return mockQuizStore.tallies.get(buildTallyKey(roomId, questionIndex)) ?? null;
  }

  async initialize(roomId: string, questionIndex: QuestionIndex): Promise<Tally> {
    const tally = TallyEntity.empty(roomId, questionIndex, new Date().toISOString());
    mockQuizStore.tallies.set(buildTallyKey(roomId, questionIndex), tally);
    return tally;
  }

  async increment(roomId: string, questionIndex: QuestionIndex, choice: Choice): Promise<Tally> {
    const existingTally =
      (await this.findByQuestion(roomId, questionIndex)) ?? (await this.initialize(roomId, questionIndex));
    const tally = existingTally.increment(choice, new Date().toISOString());
    mockQuizStore.tallies.set(buildTallyKey(roomId, questionIndex), tally);
    return tally;
  }
}
