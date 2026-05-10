import { GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { dynamoDb, requiredEnv, sessionItemToDto } from "./_dynamodb.mjs";
import { BadRequestError, emptyOptionsResponse, jsonResponse, parseJsonBody } from "./_http.mjs";

export async function handler(event) {
  if (event.requestContext?.http?.method === "OPTIONS" || event.httpMethod === "OPTIONS") {
    return emptyOptionsResponse(event);
  }

  try {
    const body = parseJsonBody(event);
    const headerToken = event.headers?.["x-session-token"] ?? event.headers?.["X-Session-Token"];
    const sessionToken = String(body.sessionToken ?? headerToken ?? "").trim();

    if (!sessionToken) {
      return jsonResponse(200, { isValid: false }, event);
    }

    const sessionsTable = requiredEnv("SESSIONS_TABLE_NAME");
    const result = await dynamoDb.send(
      new GetItemCommand({
        TableName: sessionsTable,
        Key: {
          sessionToken: { S: sessionToken },
        },
      }),
    );
    const session = sessionItemToDto(result.Item);

    if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
      return jsonResponse(200, { isValid: false }, event);
    }

    await dynamoDb.send(
      new UpdateItemCommand({
        TableName: sessionsTable,
        Key: {
          sessionToken: { S: sessionToken },
        },
        UpdateExpression: "SET lastSeenAt = :lastSeenAt",
        ExpressionAttributeValues: {
          ":lastSeenAt": { S: new Date().toISOString() },
        },
      }),
    );

    return jsonResponse(
      200,
      {
        isValid: true,
        roomId: session.roomId,
        participantId: session.participantId,
        participantName: session.participantName,
        role: session.role,
        expiresAt: session.expiresAt,
      },
      event,
    );
  } catch (error) {
    console.error(error);
    if (error instanceof BadRequestError) {
      return jsonResponse(400, { message: error.message }, event);
    }

    return jsonResponse(500, { message: "Failed to validate session." }, event);
  }
}
