export const ENDPOINTS = {
  rooms: {
    byId: (roomId: string) => `/rooms/${roomId}`,
    save: (roomId: string) => `/rooms/${roomId}`,
    startQuestion: (roomId: string) => `/rooms/${roomId}/questions/start`,
    showResult: (roomId: string) => `/rooms/${roomId}/result`,
  },
  questions: {
    list: "/questions",
    byIndex: (questionIndex: number) => `/questions/${questionIndex}`,
  },
  participants: {
    join: "/participants/join",
    byRoom: (roomId: string) => `/rooms/${roomId}/participants`,
    byId: (roomId: string, participantId: string) => `/rooms/${roomId}/participants/${participantId}`,
  },
  answers: {
    submit: "/answers",
    byQuestion: (roomId: string, questionIndex: number) =>
      `/rooms/${roomId}/questions/${questionIndex}/answers`,
    byParticipant: (roomId: string, questionIndex: number, participantId: string) =>
      `/rooms/${roomId}/questions/${questionIndex}/answers/${participantId}`,
  },
  tallies: {
    byQuestion: (roomId: string, questionIndex: number) =>
      `/rooms/${roomId}/questions/${questionIndex}/tallies`,
    increment: (roomId: string, questionIndex: number) =>
      `/rooms/${roomId}/questions/${questionIndex}/tallies/increment`,
  },
  ranking: {
    byRoom: (roomId: string) => `/rooms/${roomId}/ranking`,
  },
  participantScores: {
    byRoom: (roomId: string) => `/rooms/${roomId}/participant-scores`,
    byParticipant: (roomId: string, participantId: string) =>
      `/rooms/${roomId}/participant-scores/${participantId}`,
  },
  sessions: {
    create: "/sessions",
    byToken: (sessionToken: string) => `/sessions/${sessionToken}`,
    updateLastSeenAt: (sessionToken: string) => `/sessions/${sessionToken}/last-seen`,
    validate: "/sessions/validate",
    hostLogin: "/sessions/host-login",
  },
} as const;
