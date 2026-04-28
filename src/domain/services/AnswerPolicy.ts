import type { Answer } from "../entities/Answer";
import type { Room } from "../entities/Room";
import type { QuestionIndex } from "../valueObjects/QuestionIndex";

export class AnswerPolicy {
  canSubmit(room: Room, questionIndex: QuestionIndex, existingAnswer: Answer | null): boolean {
    return room.canAcceptAnswer(questionIndex) && existingAnswer === null;
  }

  assertCanSubmit(room: Room, questionIndex: QuestionIndex, existingAnswer: Answer | null): void {
    if (!room.canAcceptAnswer(questionIndex)) {
      throw new Error("現在はこの問題に回答できません。");
    }
    if (existingAnswer) {
      throw new Error("この問題にはすでに回答済みです。");
    }
  }
}
