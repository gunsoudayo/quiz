import { Question } from "../../../domain/entities/Question";
import { Room } from "../../../domain/entities/Room";
import { Tally } from "../../../domain/entities/Tally";
import { Choice } from "../../../domain/valueObjects/Choice";
import { QuestionIndex } from "../../../domain/valueObjects/QuestionIndex";
import { RoomStatus } from "../../../domain/valueObjects/RoomStatus";
import type { Answer } from "../../../domain/entities/Answer";
import type { Participant } from "../../../domain/entities/Participant";
import type { ParticipantScore } from "../../../domain/entities/ParticipantScore";
import type { RankingResult } from "../../../domain/services/RankingService";
import type { Session } from "../../../domain/entities/Session";

export const MOCK_ROOM_ID = "room-001";

export interface MockRealtimeEvent {
  readonly type: "QUESTION_STARTED" | "TALLY_UPDATED" | "RESULT_SHOWN" | "RANKING_UPDATED";
  readonly roomId: string;
  readonly occurredAt: string;
  readonly payload: unknown;
}

interface MockQuizStoreState {
  room: Room;
  readonly questions: Map<number, Question>;
  readonly participants: Map<string, Participant>;
  readonly sessions: Map<string, Session>;
  readonly answers: Map<string, Answer>;
  readonly tallies: Map<string, Tally>;
  readonly participantScores: Map<string, ParticipantScore>;
  readonly events: MockRealtimeEvent[];
}

const createQuestions = (): Map<number, Question> => {
  const waitingIndex = new QuestionIndex(0);
  const firstIndex = new QuestionIndex(1);
  const secondIndex = new QuestionIndex(2);

  return new Map<number, Question>([
    [
      0,
      new Question({
        questionIndex: waitingIndex,
        text: "問題開始までお待ちください。",
        choices: [],
        point: 0,
      }),
    ],
    [
      1,
      new Question({
        questionIndex: firstIndex,
        text: "会社の創立記念日はどの日でしょう？",
        choices: [
          { choice: Choice.from("A"), label: "1月15日" },
          { choice: Choice.from("B"), label: "4月1日" },
          { choice: Choice.from("C"), label: "7月7日" },
          { choice: Choice.from("D"), label: "10月10日" },
        ],
        correctChoice: Choice.from("B"),
        point: 10,
      }),
    ],
    [
      2,
      new Question({
        questionIndex: secondIndex,
        text: "レクリエーション当日の集合場所はどこでしょう？",
        choices: [
          { choice: Choice.from("A"), label: "大会議室" },
          { choice: Choice.from("B"), label: "正面玄関" },
          { choice: Choice.from("C"), label: "屋上" },
          { choice: Choice.from("D"), label: "食堂" },
        ],
        correctChoice: Choice.from("D"),
        point: 20,
      }),
    ],
  ]);
};

const createInitialStore = (): MockQuizStoreState => {
  const now = new Date().toISOString();
  const waitingIndex = new QuestionIndex(0);

  return {
    room: new Room({
      roomId: MOCK_ROOM_ID,
      currentQuestionIndex: waitingIndex,
      status: RoomStatus.waiting(),
      updatedAt: now,
    }),
    questions: createQuestions(),
    participants: new Map<string, Participant>(),
    sessions: new Map<string, Session>(),
    answers: new Map<string, Answer>(),
    tallies: new Map<string, Tally>([[buildTallyKey(MOCK_ROOM_ID, waitingIndex), Tally.empty(MOCK_ROOM_ID, waitingIndex, now)]]),
    participantScores: new Map<string, ParticipantScore>(),
    events: [],
  };
};

export const mockQuizStore: MockQuizStoreState = createInitialStore();

export function buildParticipantKey(roomId: string, participantId: string): string {
  return `${roomId}:${participantId}`;
}

export function buildAnswerKey(roomId: string, questionIndex: QuestionIndex, participantId: string): string {
  return `${roomId}:${questionIndex.value}:${participantId}`;
}

export function buildTallyKey(roomId: string, questionIndex: QuestionIndex): string {
  return `${roomId}:${questionIndex.value}`;
}

export function buildScoreKey(roomId: string, participantId: string): string {
  return `${roomId}:${participantId}`;
}

export function addMockEvent(
  type: MockRealtimeEvent["type"],
  roomId: string,
  payload: unknown,
): void {
  mockQuizStore.events.push({
    type,
    roomId,
    occurredAt: new Date().toISOString(),
    payload,
  });
}

export function serializeRanking(ranking: readonly RankingResult[]): readonly RankingResult[] {
  return ranking.map((item) => ({ ...item }));
}
