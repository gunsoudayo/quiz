import type { RoomStateDto } from "../dto/RoomStateDto";
import { Question } from "../../domain/entities/Question";
import { Room } from "../../domain/entities/Room";
import { Choice } from "../../domain/valueObjects/Choice";
import { QuestionIndex } from "../../domain/valueObjects/QuestionIndex";
import { RoomStatus } from "../../domain/valueObjects/RoomStatus";

export class GetRoomStateUseCase {
  execute(): RoomStateDto {
    // TODO: Repository 経由で rooms / tallies / participantScores / questions を取得する。
    const questionIndex = new QuestionIndex(1);
    const room = new Room({
      roomId: "room-001",
      currentQuestionIndex: questionIndex,
      status: RoomStatus.open(),
      updatedAt: "2026-04-21T12:05:15Z",
    });
    const question = new Question({
      questionIndex,
      text: "会社の創立記念日はどの日でしょう？",
      choices: [
        { choice: Choice.from("A"), label: "1月15日" },
        { choice: Choice.from("B"), label: "4月1日" },
        { choice: Choice.from("C"), label: "7月7日" },
        { choice: Choice.from("D"), label: "10月10日" },
      ],
      correctChoice: Choice.from("B"),
      point: 10,
    });

    return {
      roomId: room.roomId,
      currentQuestionIndex: room.currentQuestionIndex.value,
      status: room.status.value,
      question: {
        questionIndex: question.questionIndex.value,
        text: question.text,
        choices: question.choices.map((item) => ({
          key: item.choice.value,
          label: item.label,
        })),
        correctChoice: question.correctChoice.value,
        point: question.point,
      },
      tally: {
        A: 8,
        B: 6,
        C: 3,
        D: 2,
      },
      ranking: [
        { rank: 1, participantName: "田中", correctCount: 3, totalScore: 30 },
        { rank: 1, participantName: "佐藤", correctCount: 3, totalScore: 30 },
        { rank: 3, participantName: "鈴木", correctCount: 2, totalScore: 20 },
      ],
    };
  }
}
