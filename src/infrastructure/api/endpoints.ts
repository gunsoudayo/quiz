export const ENDPOINTS = {
  rooms: {
    byId: (roomId: string) => `/rooms/${roomId}`,
    save: (roomId: string) => `/rooms/${roomId}`,
    state: (roomId: string, participantId?: string) => {
      const path = `/api/rooms/${encodeURIComponent(roomId)}/state`;
      return participantId ? `${path}?participantId=${encodeURIComponent(participantId)}` : path;
    },
    startQuestion: "/api/host/questions/start",
    showResult: "/api/host/questions/show-result",
  },
  questions: {
    list: "/questions",
    byIndex: (questionIndex: number) => `/questions/${questionIndex}`,
  },
  participants: {
    join: "/api/join",
    byRoom: (roomId: string) => `/rooms/${roomId}/participants`,
    byId: (roomId: string, participantId: string) => `/rooms/${roomId}/participants/${participantId}`,
  },
  answers: {
    submit: "/api/answers",
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
    byRoom: (roomId: string) => `/api/ranking/${encodeURIComponent(roomId)}`,
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
    validate: "/api/session/validate",
    hostLogin: "/api/host/login",
  },
} as const;
