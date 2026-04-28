import type { ChoiceValue } from "../../../domain/valueObjects/Choice";
import type { RoomStatusValue } from "../../../domain/valueObjects/RoomStatus";
import type { SessionRole } from "../../../domain/entities/Session";

export interface ApiChoiceDto {
  readonly choice: ChoiceValue;
  readonly label: string;
}

export interface ApiRoomDto {
  readonly roomId: string;
  readonly eventId?: string;
  readonly currentQuestionIndex: number;
  readonly status: RoomStatusValue;
  readonly updatedAt: string;
}

export type SaveRoomRequestDto = ApiRoomDto;
export type GetRoomResponseDto = ApiRoomDto;
export type SaveRoomResponseDto = ApiRoomDto;

export interface ApiQuestionDto {
  readonly questionIndex: number;
  readonly text: string;
  readonly choices: readonly ApiChoiceDto[];
  readonly correctChoice?: ChoiceValue;
  readonly point: number;
}

export interface ListQuestionsResponseDto {
  readonly questions: readonly ApiQuestionDto[];
}

export type GetQuestionResponseDto = ApiQuestionDto;

export interface ApiParticipantDto {
  readonly roomId: string;
  readonly participantId: string;
  readonly participantName: string;
  readonly joinedAt: string;
}

export interface ListParticipantsResponseDto {
  readonly participants: readonly ApiParticipantDto[];
}

export type GetParticipantResponseDto = ApiParticipantDto;
export type SaveParticipantRequestDto = ApiParticipantDto;
export type SaveParticipantResponseDto = ApiParticipantDto;

export interface ApiSessionDto {
  readonly sessionToken: string;
  readonly roomId: string;
  readonly participantId?: string;
  readonly participantName?: string;
  readonly role: SessionRole;
  readonly expiresAt: string;
  readonly createdAt: string;
  readonly lastSeenAt: string;
}

export type GetSessionResponseDto = ApiSessionDto;
export type SaveSessionRequestDto = ApiSessionDto;
export type SaveSessionResponseDto = ApiSessionDto;

export interface UpdateLastSeenAtRequestDto {
  readonly lastSeenAt: string;
}

export interface ApiAnswerDto {
  readonly roomQuestionKey?: string;
  readonly roomId: string;
  readonly questionIndex: number;
  readonly participantId: string;
  readonly participantName: string;
  readonly selectedChoice: ChoiceValue;
  readonly answeredAt: string;
  readonly isCorrect?: boolean;
  readonly awardedPoints?: number;
}

export interface ListAnswersResponseDto {
  readonly answers: readonly ApiAnswerDto[];
}

export type GetAnswerResponseDto = ApiAnswerDto;
export type SaveAnswerRequestDto = ApiAnswerDto;
export type SaveAnswerResponseDto = ApiAnswerDto;

export interface ApiTallyDto {
  readonly roomId: string;
  readonly questionIndex: number;
  readonly countA: number;
  readonly countB: number;
  readonly countC: number;
  readonly countD: number;
  readonly updatedAt: string;
}

export type GetTallyResponseDto = ApiTallyDto;
export type SaveTallyRequestDto = ApiTallyDto;
export type SaveTallyResponseDto = ApiTallyDto;

export interface IncrementTallyRequestDto {
  readonly selectedChoice: ChoiceValue;
}

export interface ApiParticipantScoreDto {
  readonly roomId: string;
  readonly participantId: string;
  readonly participantName: string;
  readonly correctCount: number;
  readonly totalScore: number;
  readonly updatedAt: string;
}

export interface ListParticipantScoresResponseDto {
  readonly participantScores: readonly ApiParticipantScoreDto[];
}

export type GetParticipantScoreResponseDto = ApiParticipantScoreDto;
export type SaveParticipantScoreRequestDto = ApiParticipantScoreDto;
export type SaveParticipantScoreResponseDto = ApiParticipantScoreDto;
