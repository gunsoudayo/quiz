import type { Room } from "../entities/Room";
import type {
  RoomStateApiResponse,
  ShowResultApiRequest,
  ShowResultApiResponse,
  StartQuestionApiRequest,
  StartQuestionApiResponse,
} from "../../shared/types/api";

export interface IRoomRepository {
  findById(roomId: string): Promise<Room | null>;
  findState?(roomId: string, participantId?: string): Promise<RoomStateApiResponse | null>;
  startQuestion?(input: StartQuestionApiRequest): Promise<StartQuestionApiResponse>;
  showResult?(input: ShowResultApiRequest): Promise<ShowResultApiResponse>;
  save(room: Room): Promise<void>;
}
