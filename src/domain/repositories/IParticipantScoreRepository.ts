import type { ParticipantScore } from "../entities/ParticipantScore";

export interface IParticipantScoreRepository {
  findByParticipant(roomId: string, participantId: string): Promise<ParticipantScore | null>;
  listByRoom(roomId: string): Promise<readonly ParticipantScore[]>;
  save(score: ParticipantScore): Promise<void>;
}
