const DEV_CORS_ORIGINS = new Set(["http://127.0.0.1:5173", "http://localhost:5173"]);

export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
  }
}

export function jsonResponse(statusCode, body, event) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": resolveCorsOrigin(event),
      "Access-Control-Allow-Headers": "Content-Type,X-Session-Token",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

export function emptyOptionsResponse(event) {
  return jsonResponse(204, {}, event);
}

export function parseJsonBody(event) {
  if (!event.body) {
    throw new BadRequestError("Request body must be a non-empty JSON object.");
  }

  if (typeof event.body === "object") {
    return event.body;
  }

  if (typeof event.body !== "string") {
    throw new BadRequestError("Request body must be a JSON string.");
  }

  const text = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;

  if (text.trim().length === 0) {
    throw new BadRequestError("Request body must be a non-empty JSON object.");
  }

  try {
    const body = JSON.parse(text);

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new BadRequestError("Request body must be a JSON object.");
    }

    return body;
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new BadRequestError("Request body was not valid JSON.");
  }
}

function resolveCorsOrigin(event) {
  const configuredOrigin = process.env.CORS_ALLOW_ORIGIN;
  const requestOrigin = event?.headers?.origin ?? event?.headers?.Origin;

  if (requestOrigin && (requestOrigin === configuredOrigin || DEV_CORS_ORIGINS.has(requestOrigin))) {
    return requestOrigin;
  }

  return configuredOrigin ?? "*";
}
