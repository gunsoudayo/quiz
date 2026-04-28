import { Question } from "../../domain/entities/Question";
import { Choice } from "../../domain/valueObjects/Choice";
import { QuestionIndex } from "../../domain/valueObjects/QuestionIndex";
import type { ApiQuestionDto } from "../api/dto/ApiDtos";

export class QuestionMapper {
  static toEntity(dto: ApiQuestionDto): Question {
    return new Question({
      questionIndex: new QuestionIndex(dto.questionIndex),
      text: dto.text,
      choices: dto.choices.map((choice) => ({
        choice: Choice.from(choice.choice),
        label: choice.label,
      })),
      correctChoice: dto.correctChoice ? Choice.from(dto.correctChoice) : undefined,
      point: dto.point,
    });
  }
}
