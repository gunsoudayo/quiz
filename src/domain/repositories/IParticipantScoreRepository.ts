import type { ParticipantScore } from "../entities/ParticipantScore";
import type { RankingItemDto } from "../../application/dto/RoomStateDto";

export interface IParticipantScoreRepository {
  findByParticipant(roomId: string, participantId: string): Promise<ParticipantScore | null>;
  listRanking?(roomId: string): Promise<readonly RankingItemDto[]>;
  listByRoom(roomId: string): Promise<readonly ParticipantScore[]>;
  save(score: ParticipantScore): Promise<void>;
}
