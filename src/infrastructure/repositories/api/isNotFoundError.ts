import { ApiClientError } from "../../api/ApiClient";

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiClientError && error.status === 404;
}
