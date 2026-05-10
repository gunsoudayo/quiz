import type { Session } from "../../domain/entities/Session";
import type { ISessionRepository } from "../../domain/repositories/ISessionRepository";
import type { HostLoginApiRequest, HostLoginApiResponse, ValidateSessionApiResponse } from "../../shared/types/api";
import { ApiClient } from "../api/ApiClient";
import type { GetSessionResponseDto, UpdateLastSeenAtRequestDto } from "../api/dto/ApiDtos";
import { ENDPOINTS } from "../api/endpoints";
import { SessionMapper } from "../mappers/SessionMapper";
import { isNotFoundError } from "./api/isNotFoundError";

export class ApiSessionRepository implements ISessionRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async loginHost(input: HostLoginApiRequest): Promise<HostLoginApiResponse> {
    const response = await this.apiClient.post<unknown>(ENDPOINTS.sessions.hostLogin, input);

    return this.normalizeHostLoginResponse(response);
  }

  async validate(sessionToken: string): Promise<ValidateSessionApiResponse> {
    return await this.apiClient.post<ValidateSessionApiResponse>(ENDPOINTS.sessions.validate, { sessionToken });
  }

  async findByToken(sessionToken: string): Promise<Session | null> {
    try {
      const response = await this.apiClient.get<GetSessionResponseDto>(ENDPOINTS.sessions.byToken(sessionToken));
      return SessionMapper.toEntity(response);
    } catch (error) {
      if (isNotFoundError(error)) {
        return null;
      }

      throw error;
    }
  }

  async save(session: Session): Promise<void> {
    await this.apiClient.post<void>(ENDPOINTS.sessions.create, SessionMapper.toDto(session));
  }

  async updateLastSeenAt(sessionToken: string, lastSeenAt: string): Promise<void> {
    const request: UpdateLastSeenAtRequestDto = { lastSeenAt };
    await this.apiClient.patch<void>(ENDPOINTS.sessions.updateLastSeenAt(sessionToken), request);
  }

  private normalizeHostLoginResponse(response: unknown): HostLoginApiResponse {
    const parsedResponse = typeof response === "string" ? this.parseHostLoginResponse(response) : response;

    if (!this.isRecord(parsedResponse)) {
      throw new Error("Host login response must be a JSON object.");
    }

    const session = "data" in parsedResponse ? parsedResponse.data : parsedResponse;

    if (!this.isHostLoginApiResponse(session)) {
      throw new Error("Host login response is missing session fields.");
    }

    return session;
  }

  private parseHostLoginResponse(response: string): unknown {
    try {
      return JSON.parse(response);
    } catch {
      throw new Error("Host login response was not valid JSON.");
    }
  }

  private isHostLoginApiResponse(value: unknown): value is HostLoginApiResponse {
    if (!this.isRecord(value)) {
      return false;
    }

    return (
      typeof value.roomId === "string" &&
      typeof value.sessionToken === "string" &&
      typeof value.sessionExpiresAt === "string" &&
      value.role === "host" &&
      value.roomId.length > 0 &&
      value.sessionToken.length > 0 &&
      value.sessionExpiresAt.length > 0
    );
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }
}
