import type { Participant } from "../entities/Participant";

export interface IParticipantRepository {
  findById(roomId: string, participantId: string): Promise<Participant | null>;
  listByRoom(roomId: string): Promise<readonly Participant[]>;
  save(participant: Participant): Promise<void>;
}
