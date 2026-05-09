import { GetItemCommand, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { assertActivePlayerSession, dynamoDb, requiredEnv, sessionItemToDto } from "./_dynamodb.mjs";
import { emptyOptionsResponse, jsonResponse, parseJsonBody } from "./_http.mjs";

const tallyAttributeByChoice = {
  A: "countA",
  B: "countB",
  C: "countC",
  D: "countD",
};

function tallyFromItem(item) {
  return {
    A: Number(item?.countA?.N ?? 0),
    B: Number(item?.countB?.N ?? 0),
    C: Number(item?.countC?.N ?? 0),
    D: Number(item?.countD?.N ?? 0),
  };
}

export async function handler(event) {
  if (event.requestContext?.http?.method === "OPTIONS" || event.httpMethod === "OPTIONS") {
    return emptyOptionsResponse();
  }

  try {
    const body = parseJsonBody(event);
    const headerToken = event.headers?.["x-session-token"] ?? event.headers?.["X-Session-Token"];
    const sessionToken = String(body.sessionToken ?? headerToken ?? "").trim();
    const questionIndex = Number(body.questionIndex);
    const selectedChoice = String(body.selectedChoice ?? "").trim();
    const tallyAttribute = tallyAttributeByChoice[selectedChoice];

    if (!sessionToken) {
      return jsonResponse(401, { message: "Player session is required." });
    }
    if (!Number.isInteger(questionIndex) || questionIndex <= 0) {
      return jsonResponse(400, { message: "questionIndex must be a positive integer." });
    }
    if (!tallyAttribute) {
      return jsonResponse(400, { message: "selectedChoice must be A, B, C, or D." });
    }

    const answersTable = requiredEnv("ANSWERS_TABLE_NAME");
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

    if (!assertActivePlayerSession(session)) {
      return jsonResponse(401, { message: "Player session is invalid." });
    }

    const roomQuestionKey = `ROOM#${session.roomId}#QUESTION#${questionIndex}`;
    const answeredAt = new Date().toISOString();

    try {
      await dynamoDb.send(
        new TransactWriteItemsCommand({
          TransactItems: [
            {
              ConditionCheck: {
                TableName: roomsTable,
                Key: {
                  roomId: { S: session.roomId },
                },
                ConditionExpression: "currentQuestionIndex = :questionIndex AND #status = :openStatus",
                ExpressionAttributeNames: {
                  "#status": "status",
                },
                ExpressionAttributeValues: {
                  ":questionIndex": { N: String(questionIndex) },
                  ":openStatus": { S: "open" },
                },
              },
            },
            {
              Put: {
                TableName: answersTable,
                Item: {
                  roomQuestionKey: { S: roomQuestionKey },
                  roomId: { S: session.roomId },
                  questionIndex: { N: String(questionIndex) },
                  participantId: { S: session.participantId },
                  participantName: { S: session.participantName },
                  selectedChoice: { S: selectedChoice },
                  answeredAt: { S: answeredAt },
                },
                ConditionExpression: "attribute_not_exists(roomQuestionKey) AND attribute_not_exists(participantId)",
              },
            },
            {
              Update: {
                TableName: talliesTable,
                Key: {
                  roomId: { S: session.roomId },
                  questionIndex: { N: String(questionIndex) },
                },
                UpdateExpression: `SET ${tallyAttribute} = if_not_exists(${tallyAttribute}, :zero) + :one, updatedAt = :updatedAt`,
                ExpressionAttributeValues: {
                  ":zero": { N: "0" },
                  ":one": { N: "1" },
                  ":updatedAt": { S: answeredAt },
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
                  ":lastSeenAt": { S: answeredAt },
                },
              },
            },
          ],
        }),
      );
    } catch (error) {
      if (error?.name === "TransactionCanceledException") {
        return jsonResponse(409, { message: "Answer cannot be submitted." });
      }

      throw error;
    }

    const tallyResult = await dynamoDb.send(
      new GetItemCommand({
        TableName: talliesTable,
        Key: {
          roomId: { S: session.roomId },
          questionIndex: { N: String(questionIndex) },
        },
      }),
    );

    return jsonResponse(200, {
      selectedChoice,
      tally: tallyFromItem(tallyResult.Item),
    });
  } catch (error) {
    console.error(error);
    return jsonResponse(500, { message: "Failed to submit answer." });
  }
}
