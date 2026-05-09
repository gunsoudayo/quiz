export type ApiChoiceValue = "A" | "B" | "C" | "D";
export type ApiRoomStatusValue = "waiting" | "open" | "result";

export interface RoomStateApiChoice {
  readonly key: ApiChoiceValue;
  readonly label: string;
}

export interface RoomStateApiQuestion {
  readonly questionIndex: number;
  readonly text: string;
  readonly choices: readonly RoomStateApiChoice[];
  readonly point: number;
  readonly correctChoice?: ApiChoiceValue;
}

export interface RoomStateApiTally {
  readonly A: number;
  readonly B: number;
  readonly C: number;
  readonly D: number;
}

export interface RoomStateApiRankingItem {
  readonly rank: number;
  readonly participantName: string;
  readonly correctCount: number;
  readonly totalScore: number;
}

export interface RoomStateApiResponse {
  readonly roomId: string;
  readonly currentQuestionIndex: number;
  readonly status: ApiRoomStatusValue;
  readonly question: RoomStateApiQuestion;
  readonly tally: RoomStateApiTally;
  readonly ranking: readonly RoomStateApiRankingItem[];
  readonly currentParticipantAnswer?: ApiChoiceValue;
}

export interface JoinParticipantApiRequest {
  readonly participantName: string;
  readonly password: string;
  readonly roomId?: string;
}

export interface JoinParticipantApiResponse {
  readonly roomId: string;
  readonly participantId: string;
  readonly participantName: string;
  readonly role: "player";
  readonly sessionToken: string;
  readonly sessionExpiresAt: string;
}

export interface ValidateSessionApiRequest {
  readonly sessionToken: string;
}

export interface ValidateSessionApiResponse {
  readonly isValid: boolean;
  readonly roomId?: string;
  readonly participantId?: string;
  readonly participantName?: string;
  readonly role?: "player" | "host";
  readonly expiresAt?: string;
}

export interface StartQuestionApiRequest {
  readonly sessionToken: string;
  readonly roomId: string;
  readonly questionIndex: number;
}

export interface StartQuestionApiResponse {
  readonly roomId: string;
  readonly currentQuestionIndex: number;
  readonly status: "open";
  readonly updatedAt: string;
}

export interface HostLoginApiRequest {
  readonly password: string;
  readonly roomId?: string;
}

export interface HostLoginApiResponse {
  readonly roomId: string;
  readonly role: "host";
  readonly sessionToken: string;
  readonly sessionExpiresAt: string;
}

export interface SubmitAnswerApiRequest {
  readonly sessionToken: string;
  readonly questionIndex: number;
  readonly selectedChoice: ApiChoiceValue;
}

export interface SubmitAnswerApiResponse {
  readonly selectedChoice: ApiChoiceValue;
  readonly tally: RoomStateApiTally;
}

export interface ShowResultApiRequest {
  readonly sessionToken: string;
  readonly roomId: string;
}

export interface ShowResultApiResponse {
  readonly roomId: string;
  readonly currentQuestionIndex: number;
  readonly status: "result";
  readonly correctChoice?: ApiChoiceValue;
  readonly ranking?: readonly RoomStateApiRankingItem[];
}

export type RankingApiResponse =
  | readonly RoomStateApiRankingItem[]
  | {
      readonly ranking: readonly RoomStateApiRankingItem[];
    };
