import { Room } from "../../domain/entities/Room";
import { QuestionIndex } from "../../domain/valueObjects/QuestionIndex";
import { RoomStatus } from "../../domain/valueObjects/RoomStatus";
import type { ApiRoomDto } from "../api/dto/ApiDtos";

export class RoomMapper {
  static toEntity(dto: ApiRoomDto): Room {
    return new Room({
      roomId: dto.roomId,
      currentQuestionIndex: new QuestionIndex(dto.currentQuestionIndex),
      status: RoomStatus.from(dto.status),
      updatedAt: dto.updatedAt,
    });
  }

  static toDto(room: Room): ApiRoomDto {
    return {
      roomId: room.roomId,
      currentQuestionIndex: room.currentQuestionIndex.value,
      status: room.status.value,
      updatedAt: room.updatedAt,
    };
  }
}
