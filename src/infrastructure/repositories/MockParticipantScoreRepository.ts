import type { ParticipantScore } from "../../domain/entities/ParticipantScore";
import type { IParticipantScoreRepository } from "../../domain/repositories/IParticipantScoreRepository";
import { buildScoreKey, mockQuizStore } from "./mock/mockQuizStore";

export class MockParticipantScoreRepository implements IParticipantScoreRepository {
  async findByParticipant(roomId: string, participantId: string): Promise<ParticipantScore | null> {
    return mockQuizStore.participantScores.get(buildScoreKey(roomId, participantId)) ?? null;
  }

  async listByRoom(roomId: string): Promise<readonly ParticipantScore[]> {
    return [...mockQuizStore.participantScores.values()].filter((score) => score.roomId === roomId);
  }

  async save(score: ParticipantScore): Promise<void> {
    mockQuizStore.participantScores.set(buildScoreKey(score.roomId, score.participantId), score);
  }
}
