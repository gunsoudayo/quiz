export function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": process.env.CORS_ALLOW_ORIGIN ?? "*",
      "Access-Control-Allow-Headers": "Content-Type,X-Session-Token",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

export function emptyOptionsResponse() {
  return jsonResponse(204, {});
}

export function parseJsonBody(event) {
  if (!event.body) {
    return {};
  }

  const text = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
  return JSON.parse(text);
}
