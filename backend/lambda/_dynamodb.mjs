import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const dynamoDb = new DynamoDBClient({});

export function requiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function sessionItemToDto(item) {
  if (!item) {
    return null;
  }

  return {
    sessionToken: item.sessionToken.S,
    roomId: item.roomId.S,
    participantId: item.participantId?.S,
    participantName: item.participantName?.S,
    role: item.role.S,
    expiresAt: item.expiresAt.S,
    createdAt: item.createdAt.S,
    lastSeenAt: item.lastSeenAt.S,
  };
}

export function assertActiveHostSession(session) {
  if (!session || session.role !== "host" || new Date(session.expiresAt).getTime() <= Date.now()) {
    return false;
  }

  return true;
}

export function assertActivePlayerSession(session) {
  if (
    !session ||
    session.role !== "player" ||
    !session.participantId ||
    !session.participantName ||
    new Date(session.expiresAt).getTime() <= Date.now()
  ) {
    return false;
  }

  return true;
}
