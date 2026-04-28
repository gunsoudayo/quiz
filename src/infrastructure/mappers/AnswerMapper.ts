import { Answer } from "../../domain/entities/Answer";
import { Choice } from "../../domain/valueObjects/Choice";
import { QuestionIndex } from "../../domain/valueObjects/QuestionIndex";
import type { ApiAnswerDto } from "../api/dto/ApiDtos";

export class AnswerMapper {
  static toEntity(dto: ApiAnswerDto): Answer {
    return new Answer({
      roomId: dto.roomId,
      questionIndex: new QuestionIndex(dto.questionIndex),
      participantId: dto.participantId,
      participantName: dto.participantName,
      selectedChoice: Choice.from(dto.selectedChoice),
      answeredAt: dto.answeredAt,
      isCorrect: dto.isCorrect,
      awardedPoints: dto.awardedPoints,
    });
  }

  static toDto(answer: Answer): ApiAnswerDto {
    return {
      roomId: answer.roomId,
      questionIndex: answer.questionIndex.value,
      participantId: answer.participantId,
      participantName: answer.participantName,
      selectedChoice: answer.selectedChoice.value,
      answeredAt: answer.answeredAt,
      isCorrect: answer.isCorrect,
      awardedPoints: answer.awardedPoints,
    };
  }
}
