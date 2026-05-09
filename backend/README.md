# Backend API Notes

Minimal Lambda handlers are provided for the first API-backed flow.

## Routes

- `POST /api/join` -> `backend/lambda/join.mjs`
- `POST /api/session/validate` -> `backend/lambda/validateSession.mjs`
- `POST /api/host/login` -> `backend/lambda/hostLogin.mjs`
- `POST /api/host/questions/start` -> `backend/lambda/startQuestion.mjs`
- `POST /api/answers` -> `backend/lambda/submitAnswer.mjs`

`backend/api-gateway/openapi.yaml` contains a minimal API Gateway OpenAPI definition with Lambda proxy integration placeholders.

## Environment Variables

Both handlers expect these DynamoDB tables to exist with the keys described in `quiz_app_table_definitions.txt`.

- `PARTICIPANTS_TABLE_NAME`
- `SESSIONS_TABLE_NAME`
- `ROOMS_TABLE_NAME`
- `TALLIES_TABLE_NAME`
- `ANSWERS_TABLE_NAME`
- `ROOM_ID` optional, defaults to `room-001`
- `JOIN_PASSWORD` optional. When unset, any non-empty join password is accepted.
- `ADMIN_PASSWORD`
- `CORS_ALLOW_ORIGIN` optional, defaults to `*`

## DynamoDB Keys

- `participants`: partition key `roomId`, sort key `participantId`
- `sessions`: partition key `sessionToken`
- `rooms`: partition key `roomId`
- `tallies`: partition key `roomId`, sort key `questionIndex`
- `answers`: partition key `roomQuestionKey`, sort key `participantId`
