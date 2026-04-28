import { Tally } from "../../domain/entities/Tally";
import { QuestionIndex } from "../../domain/valueObjects/QuestionIndex";
import type { ApiTallyDto } from "../api/dto/ApiDtos";

export class TallyMapper {
  static toEntity(dto: ApiTallyDto): Tally {
    return new Tally({
      roomId: dto.roomId,
      questionIndex: new QuestionIndex(dto.questionIndex),
      counts: {
        A: dto.countA,
        B: dto.countB,
        C: dto.countC,
        D: dto.countD,
      },
      updatedAt: dto.updatedAt,
    });
  }

  static toDto(tally: Tally): ApiTallyDto {
    const counts = tally.toDisplayModel();

    return {
      roomId: tally.roomId,
      questionIndex: tally.questionIndex.value,
      countA: counts.A,
      countB: counts.B,
      countC: counts.C,
      countD: counts.D,
      updatedAt: tally.updatedAt,
    };
  }
}
