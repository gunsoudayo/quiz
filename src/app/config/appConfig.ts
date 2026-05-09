type RepositoryMode = "api" | "mock";

const repositoryMode: RepositoryMode = import.meta.env.VITE_REPOSITORY_MODE === "api" ? "api" : "mock";
const apiMode = import.meta.env.VITE_API_MODE === "api" || repositoryMode === "api";
const featureMode = (envName: string): RepositoryMode => (import.meta.env[envName] === "api" || apiMode ? "api" : "mock");

export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
  repositoryMode,
  apiMode,
  roomRepositoryMode: featureMode("VITE_ROOM_REPOSITORY_MODE"),
  joinRepositoryMode: featureMode("VITE_JOIN_REPOSITORY_MODE"),
  sessionRepositoryMode: featureMode("VITE_SESSION_REPOSITORY_MODE"),
  hostLoginRepositoryMode: featureMode("VITE_HOST_LOGIN_REPOSITORY_MODE"),
  startQuestionRepositoryMode: featureMode("VITE_START_QUESTION_REPOSITORY_MODE"),
  submitAnswerRepositoryMode: featureMode("VITE_SUBMIT_ANSWER_REPOSITORY_MODE"),
  showResultRepositoryMode: featureMode("VITE_SHOW_RESULT_REPOSITORY_MODE"),
  rankingRepositoryMode: featureMode("VITE_RANKING_REPOSITORY_MODE"),
} as const;
