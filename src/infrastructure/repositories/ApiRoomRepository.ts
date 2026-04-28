import type { Room } from "../../domain/entities/Room";
import type { IRoomRepository } from "../../domain/repositories/IRoomRepository";
import { ApiClient } from "../api/ApiClient";
import type { GetRoomResponseDto } from "../api/dto/ApiDtos";
import { ENDPOINTS } from "../api/endpoints";
import { RoomMapper } from "../mappers/RoomMapper";
import { isNotFoundError } from "./api/isNotFoundError";

export class ApiRoomRepository implements IRoomRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async findById(roomId: string): Promise<Room | null> {
    try {
      const response = await this.apiClient.get<GetRoomResponseDto>(ENDPOINTS.rooms.byId(roomId));
      return RoomMapper.toEntity(response);
    } catch (error) {
      if (isNotFoundError(error)) {
        return null;
      }

      throw error;
    }
  }

  async save(room: Room): Promise<void> {
    await this.apiClient.put<void>(ENDPOINTS.rooms.save(room.roomId), RoomMapper.toDto(room));
  }
}
