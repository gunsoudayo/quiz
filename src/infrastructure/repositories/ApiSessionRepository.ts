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
    return await this.apiClient.post<HostLoginApiResponse>(ENDPOINTS.sessions.hostLogin, input);
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
}
