import { GetItemCommand, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { assertActiveHostSession, dynamoDb, requiredEnv, sessionItemToDto } from "./_dynamodb.mjs";
import { emptyOptionsResponse, jsonResponse, parseJsonBody } from "./_http.mjs";

export async function handler(event) {
  if (event.requestContext?.http?.method === "OPTIONS" || event.httpMethod === "OPTIONS") {
    return emptyOptionsResponse();
  }

  try {
    const body = parseJsonBody(event);
    const headerToken = event.headers?.["x-session-token"] ?? event.headers?.["X-Session-Token"];
    const sessionToken = String(body.sessionToken ?? headerToken ?? "").trim();
    const roomId = String(body.roomId ?? process.env.ROOM_ID ?? "room-001").trim();
    const questionIndex = Number(body.questionIndex);

    if (!sessionToken) {
      return jsonResponse(401, { message: "Host session is required." });
    }
    if (!roomId) {
      return jsonResponse(400, { message: "roomId is required." });
    }
    if (!Number.isInteger(questionIndex) || questionIndex <= 0) {
      return jsonResponse(400, { message: "questionIndex must be a positive integer." });
    }

    const roomsTable = requiredEnv("ROOMS_TABLE_NAME");
    const talliesTable = requiredEnv("TALLIES_TABLE_NAME");
    const sessionsTable = requiredEnv("SESSIONS_TABLE_NAME");
    const sessionResult = await dynamoDb.send(
      new GetItemCommand({
        TableName: sessionsTable,
        Key: {
          sessionToken: { S: sessionToken },
        },
      }),
    );
    const session = sessionItemToDto(sessionResult.Item);

    if (!assertActiveHostSession(session)) {
      return jsonResponse(401, { message: "Host session is invalid." });
    }
    if (session.roomId !== roomId) {
      return jsonResponse(403, { message: "Host session is not allowed for this room." });
    }

    const updatedAt = new Date().toISOString();

    await dynamoDb.send(
      new TransactWriteItemsCommand({
        TransactItems: [
          {
            Update: {
              TableName: roomsTable,
              Key: {
                roomId: { S: roomId },
              },
              UpdateExpression: "SET currentQuestionIndex = :questionIndex, #status = :status, updatedAt = :updatedAt",
              ConditionExpression: "attribute_exists(roomId)",
              ExpressionAttributeNames: {
                "#status": "status",
              },
              ExpressionAttributeValues: {
                ":questionIndex": { N: String(questionIndex) },
                ":status": { S: "open" },
                ":updatedAt": { S: updatedAt },
              },
            },
          },
          {
            Put: {
              TableName: talliesTable,
              Item: {
                roomId: { S: roomId },
                questionIndex: { N: String(questionIndex) },
                countA: { N: "0" },
                countB: { N: "0" },
                countC: { N: "0" },
                countD: { N: "0" },
                updatedAt: { S: updatedAt },
              },
            },
          },
          {
            Update: {
              TableName: sessionsTable,
              Key: {
                sessionToken: { S: sessionToken },
              },
              UpdateExpression: "SET lastSeenAt = :lastSeenAt",
              ExpressionAttributeValues: {
                ":lastSeenAt": { S: updatedAt },
              },
            },
          },
        ],
      }),
    );

    return jsonResponse(200, {
      roomId,
      currentQuestionIndex: questionIndex,
      status: "open",
      updatedAt,
    });
  } catch (error) {
    console.error(error);
    return jsonResponse(500, { message: "Failed to start question." });
  }
}
