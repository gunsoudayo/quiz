import type { Room } from "../../domain/entities/Room";
import type { IRoomRepository } from "../../domain/repositories/IRoomRepository";
import { mockQuizStore } from "./mock/mockQuizStore";

export class MockRoomRepository implements IRoomRepository {
  async findById(roomId: string): Promise<Room | null> {
    return mockQuizStore.room.roomId === roomId ? mockQuizStore.room : null;
  }

  async save(room: Room): Promise<void> {
    mockQuizStore.room = room;
  }
}
