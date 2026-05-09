import type { Participant } from "../entities/Participant";
import type { JoinParticipantApiRequest, JoinParticipantApiResponse } from "../../shared/types/api";

export interface IParticipantRepository {
  joinParticipant?(input: JoinParticipantApiRequest): Promise<JoinParticipantApiResponse>;
  findById(roomId: string, participantId: string): Promise<Participant | null>;
  listByRoom(roomId: string): Promise<readonly Participant[]>;
  save(participant: Participant): Promise<void>;
}
