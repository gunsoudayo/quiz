import type { ParticipantScore } from "../entities/ParticipantScore";

export interface RankingResult {
  readonly rank: number;
  readonly participantId: string;
  readonly participantName: string;
  readonly correctCount: number;
  readonly totalScore: number;
}

export class RankingService {
  buildRanking(scores: readonly ParticipantScore[]): readonly RankingResult[] {
    const sortedScores = [...scores].sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }

      return a.participantName.localeCompare(b.participantName, "ja");
    });

    let previousScore: number | null = null;
    let previousRank = 0;

    return sortedScores.map((score, index) => {
      const rank = previousScore === score.totalScore ? previousRank : index + 1;
      previousScore = score.totalScore;
      previousRank = rank;

      return {
        rank,
        participantId: score.participantId,
        participantName: score.participantName,
        correctCount: score.correctCount,
        totalScore: score.totalScore,
      };
    });
  }
}
