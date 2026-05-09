import type { Room } from "../entities/Room";
import type {
  RoomStateApiResponse,
  ShowResultApiRequest,
  ShowResultApiResponse,
  StartQuestionApiRequest,
} from "../../shared/types/api";

export interface IRoomRepository {
  findById(roomId: string): Promise<Room | null>;
  findState?(roomId: string, participantId?: string): Promise<RoomStateApiResponse | null>;
  startQuestion?(input: StartQuestionApiRequest): Promise<void>;
  showResult?(input: ShowResultApiRequest): Promise<ShowResultApiResponse>;
  save(room: Room): Promise<void>;
}
