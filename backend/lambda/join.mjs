import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "node:crypto";
import { dynamoDb, requiredEnv } from "./_dynamodb.mjs";
import { emptyOptionsResponse, jsonResponse, parseJsonBody } from "./_http.mjs";

const PLAYER_SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export async function handler(event) {
  if (event.requestContext?.http?.method === "OPTIONS" || event.httpMethod === "OPTIONS") {
    return emptyOptionsResponse();
  }

  try {
    const body = parseJsonBody(event);
    const participantName = String(body.participantName ?? "").trim();
    const password = String(body.password ?? "");
    const roomId = String(body.roomId ?? process.env.ROOM_ID ?? "room-001");

    if (!participantName) {
      return jsonResponse(400, { message: "participantName is required." });
    }
    if (!password) {
      return jsonResponse(400, { message: "password is required." });
    }
    if (process.env.JOIN_PASSWORD && password !== process.env.JOIN_PASSWORD) {
      return jsonResponse(401, { message: "Join password is invalid." });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + PLAYER_SESSION_TTL_MS);
    const suffix = randomUUID().replaceAll("-", "").slice(0, 12);
    const participantId = `p_${suffix}`;
    const sessionToken = `sess_${suffix}`;
    const participantsTable = requiredEnv("PARTICIPANTS_TABLE_NAME");
    const sessionsTable = requiredEnv("SESSIONS_TABLE_NAME");

    await dynamoDb.send(
      new PutItemCommand({
        TableName: participantsTable,
        Item: {
          roomId: { S: roomId },
          participantId: { S: participantId },
          participantName: { S: participantName },
          joinedAt: { S: now.toISOString() },
        },
        ConditionExpression: "attribute_not_exists(roomId) AND attribute_not_exists(participantId)",
      }),
    );

    await dynamoDb.send(
      new PutItemCommand({
        TableName: sessionsTable,
        Item: {
          sessionToken: { S: sessionToken },
          roomId: { S: roomId },
          participantId: { S: participantId },
          participantName: { S: participantName },
          role: { S: "player" },
          expiresAt: { S: expiresAt.toISOString() },
          createdAt: { S: now.toISOString() },
          lastSeenAt: { S: now.toISOString() },
        },
        ConditionExpression: "attribute_not_exists(sessionToken)",
      }),
    );

    return jsonResponse(200, {
      roomId,
      participantId,
      participantName,
      role: "player",
      sessionToken,
      sessionExpiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error(error);
    return jsonResponse(500, { message: "Failed to join." });
  }
}
