export const ENDPOINTS = {
  rooms: {
    byId: (roomId: string) => `/rooms/${roomId}`,
    startQuestion: (roomId: string) => `/rooms/${roomId}/questions/start`,
    showResult: (roomId: string) => `/rooms/${roomId}/result`,
  },
  participants: {
    join: "/participants/join",
  },
  answers: {
    submit: "/answers",
    byQuestion: (roomId: string, questionIndex: number) =>
      `/rooms/${roomId}/questions/${questionIndex}/answers`,
  },
  tallies: {
    byQuestion: (roomId: string, questionIndex: number) =>
      `/rooms/${roomId}/questions/${questionIndex}/tallies`,
  },
  ranking: {
    byRoom: (roomId: string) => `/rooms/${roomId}/ranking`,
  },
  sessions: {
    validate: "/sessions/validate",
    hostLogin: "/sessions/host-login",
  },
} as const;
