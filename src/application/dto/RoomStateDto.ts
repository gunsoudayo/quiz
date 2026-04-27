import type { ChoiceValue } from "../../domain/valueObjects/Choice";
import type { RoomStatusValue } from "../../domain/valueObjects/RoomStatus";

export interface ChoiceDto {
  readonly key: ChoiceValue;
  readonly label: string;
}

export interface QuestionDto {
  readonly questionIndex: number;
  readonly text: string;
  readonly choices: readonly ChoiceDto[];
  readonly point: number;
  readonly correctChoice?: ChoiceValue;
}

export interface TallyDto {
  readonly A: number;
  readonly B: number;
  readonly C: number;
  readonly D: number;
}

export interface RankingItemDto {
  readonly rank: number;
  readonly participantName: string;
  readonly correctCount: number;
  readonly totalScore: number;
}

export interface RoomStateDto {
  readonly roomId: string;
  readonly currentQuestionIndex: number;
  readonly status: RoomStatusValue;
  readonly question: QuestionDto;
  readonly tally: TallyDto;
  readonly ranking: readonly RankingItemDto[];
}
