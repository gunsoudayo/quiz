import type { Room } from "../entities/Room";

export interface IRoomRepository {
  findById(roomId: string): Promise<Room | null>;
  save(room: Room): Promise<void>;
}
