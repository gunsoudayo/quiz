import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "node:crypto";
import { dynamoDb, requiredEnv } from "./_dynamodb.mjs";
import { emptyOptionsResponse, jsonResponse, parseJsonBody } from "./_http.mjs";

const HOST_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export async function handler(event) {
  if (event.requestContext?.http?.method === "OPTIONS" || event.httpMethod === "OPTIONS") {
    return emptyOptionsResponse();
  }

  try {
    const body = parseJsonBody(event);
    const password = String(body.password ?? "");
    const roomId = String(body.roomId ?? process.env.ROOM_ID ?? "room-001").trim();
    const expectedPassword = requiredEnv("ADMIN_PASSWORD");

    if (!roomId) {
      return jsonResponse(400, { message: "roomId is required." });
    }
    if (!password) {
      return jsonResponse(400, { message: "password is required." });
    }
    if (password !== expectedPassword) {
      return jsonResponse(401, { message: "Admin password is invalid." });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + HOST_SESSION_TTL_MS);
    const suffix = randomUUID().replaceAll("-", "").slice(0, 12);
    const sessionToken = `sess_host_${suffix}`;
    const sessionsTable = requiredEnv("SESSIONS_TABLE_NAME");

    await dynamoDb.send(
      new PutItemCommand({
        TableName: sessionsTable,
        Item: {
          sessionToken: { S: sessionToken },
          roomId: { S: roomId },
          role: { S: "host" },
          expiresAt: { S: expiresAt.toISOString() },
          createdAt: { S: now.toISOString() },
          lastSeenAt: { S: now.toISOString() },
        },
        ConditionExpression: "attribute_not_exists(sessionToken)",
      }),
    );

    return jsonResponse(200, {
      roomId,
      role: "host",
      sessionToken,
      sessionExpiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error(error);
    return jsonResponse(500, { message: "Failed to log in host." });
  }
}
