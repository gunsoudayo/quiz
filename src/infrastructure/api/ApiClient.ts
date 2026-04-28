import { appConfig } from "../../app/config/appConfig";

export interface ApiClientOptions {
  readonly baseUrl?: string;
  readonly getSessionToken?: () => string | null;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly responseBody: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly getSessionToken?: () => string | null;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? appConfig.apiBaseUrl;
    this.getSessionToken = options.getSessionToken;
  }

  async get<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
    return this.request<TResponse>(path, { ...init, method: "GET" });
  }

  async post<TResponse>(path: string, body?: unknown, init?: RequestInit): Promise<TResponse> {
    return this.request<TResponse>(path, {
      ...init,
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  async put<TResponse>(path: string, body?: unknown, init?: RequestInit): Promise<TResponse> {
    return this.request<TResponse>(path, {
      ...init,
      method: "PUT",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  async patch<TResponse>(path: string, body?: unknown, init?: RequestInit): Promise<TResponse> {
    return this.request<TResponse>(path, {
      ...init,
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  async delete<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
    return this.request<TResponse>(path, { ...init, method: "DELETE" });
  }

  private async request<TResponse>(path: string, init: RequestInit): Promise<TResponse> {
    // TODO: AWS Lambda API の認証・リトライ・エラー形式に合わせて拡張する。
    const response = await fetch(this.buildUrl(path), this.withDefaultHeaders(init));
    const responseText = await response.text();

    if (!response.ok) {
      throw new ApiClientError(`API request failed: ${response.status}`, response.status, responseText);
    }

    if (response.status === 204 || responseText.length === 0) {
      return undefined as TResponse;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return JSON.parse(responseText) as TResponse;
    }

    return responseText as TResponse;
  }

  private buildUrl(path: string): string {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    const normalizedBaseUrl = this.baseUrl.replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${normalizedBaseUrl}${normalizedPath}`;
  }

  private withDefaultHeaders(init: RequestInit): RequestInit {
    const headers = new Headers(init.headers);
    const sessionToken = this.getSessionToken?.();

    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }
    if (sessionToken) {
      headers.set("X-Session-Token", sessionToken);
    }

    return { ...init, headers };
  }
}
