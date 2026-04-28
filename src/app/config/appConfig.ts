export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
  repositoryMode: import.meta.env.VITE_REPOSITORY_MODE === "api" ? "api" : "mock",
} as const;
