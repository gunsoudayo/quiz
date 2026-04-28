import type { Participant } from "../../domain/entities/Participant";
import type { IParticipantRepository } from "../../domain/repositories/IParticipantRepository";
import { buildParticipantKey, mockQuizStore } from "./mock/mockQuizStore";

export class MockParticipantRepository implements IParticipantRepository {
  async findById(roomId: string, participantId: string): Promise<Participant | null> {
    return mockQuizStore.participants.get(buildParticipantKey(roomId, participantId)) ?? null;
  }

  async listByRoom(roomId: string): Promise<readonly Participant[]> {
    return [...mockQuizStore.participants.values()].filter((participant) => participant.roomId === roomId);
  }

  async save(participant: Participant): Promise<void> {
    mockQuizStore.participants.set(buildParticipantKey(participant.roomId, participant.participantId), participant);
  }
}
