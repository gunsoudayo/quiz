import { GetRankingUseCase } from "../../application/usecases/GetRankingUseCase";
import { GetRoomStateUseCase } from "../../application/usecases/GetRoomStateUseCase";
import { JoinParticipantUseCase } from "../../application/usecases/JoinParticipantUseCase";
import { LoginHostUseCase } from "../../application/usecases/LoginHostUseCase";
import { ShowResultUseCase } from "../../application/usecases/ShowResultUseCase";
import { StartQuestionUseCase } from "../../application/usecases/StartQuestionUseCase";
import { SubmitAnswerUseCase } from "../../application/usecases/SubmitAnswerUseCase";
import { ValidateSessionUseCase } from "../../application/usecases/ValidateSessionUseCase";
import type { IAnswerRepository } from "../../domain/repositories/IAnswerRepository";
import type { IParticipantRepository } from "../../domain/repositories/IParticipantRepository";
import type { IParticipantScoreRepository } from "../../domain/repositories/IParticipantScoreRepository";
import type { IQuestionRepository } from "../../domain/repositories/IQuestionRepository";
import type { IRealtimeEventRepository } from "../../domain/repositories/IRealtimeEventRepository";
import type { IRoomRepository } from "../../domain/repositories/IRoomRepository";
import type { ISessionRepository } from "../../domain/repositories/ISessionRepository";
import type { ITallyRepository } from "../../domain/repositories/ITallyRepository";
import { RankingService } from "../../domain/services/RankingService";
import { ScoringService } from "../../domain/services/ScoringService";
import { ApiClient } from "../../infrastructure/api/ApiClient";
import { ApiAnswerRepository } from "../../infrastructure/repositories/ApiAnswerRepository";
import { ApiParticipantRepository } from "../../infrastructure/repositories/ApiParticipantRepository";
import { ApiParticipantScoreRepository } from "../../infrastructure/repositories/ApiParticipantScoreRepository";
import { ApiQuestionRepository } from "../../infrastructure/repositories/ApiQuestionRepository";
import { ApiRoomRepository } from "../../infrastructure/repositories/ApiRoomRepository";
import { ApiSessionRepository } from "../../infrastructure/repositories/ApiSessionRepository";
import { ApiTallyRepository } from "../../infrastructure/repositories/ApiTallyRepository";
import { MockAnswerRepository } from "../../infrastructure/repositories/MockAnswerRepository";
import { MockParticipantRepository } from "../../infrastructure/repositories/MockParticipantRepository";
import { MockParticipantScoreRepository } from "../../infrastructure/repositories/MockParticipantScoreRepository";
import { MockQuestionRepository } from "../../infrastructure/repositories/MockQuestionRepository";
import { MockRealtimeEventRepository } from "../../infrastructure/repositories/MockRealtimeEventRepository";
import { MockRoomRepository } from "../../infrastructure/repositories/MockRoomRepository";
import { MockSessionRepository } from "../../infrastructure/repositories/MockSessionRepository";
import { MockTallyRepository } from "../../infrastructure/repositories/MockTallyRepository";
import { NoopRealtimeEventRepository } from "../../infrastructure/repositories/NoopRealtimeEventRepository";
import { SessionStorageGateway } from "../../infrastructure/storage/SessionStorageGateway";
import { appConfig } from "./appConfig";

interface RepositorySet {
  readonly roomRepository: IRoomRepository;
  readonly participantRepository: IParticipantRepository;
  readonly questionRepository: IQuestionRepository;
  readonly answerRepository: IAnswerRepository;
  readonly tallyRepository: ITallyRepository;
  readonly participantScoreRepository: IParticipantScoreRepository;
  readonly sessionRepository: ISessionRepository;
  readonly realtimeEventRepository: IRealtimeEventRepository;
}

const sessionStorageGateway = new SessionStorageGateway();

const createApiClient = (): ApiClient =>
  new ApiClient({
    getSessionToken: () =>
      sessionStorageGateway.getParticipantSession()?.sessionToken ??
      sessionStorageGateway.getHostSession()?.sessionToken ??
      null,
  });

const createMockRepositories = (): RepositorySet => ({
  roomRepository: new MockRoomRepository(),
  participantRepository: new MockParticipantRepository(),
  questionRepository: new MockQuestionRepository(),
  answerRepository: new MockAnswerRepository(),
  tallyRepository: new MockTallyRepository(),
  participantScoreRepository: new MockParticipantScoreRepository(),
  sessionRepository: new MockSessionRepository(),
  realtimeEventRepository: new MockRealtimeEventRepository(),
});

const createApiRepositories = (): RepositorySet => {
  const apiClient = createApiClient();

  return {
    roomRepository: new ApiRoomRepository(apiClient),
    participantRepository: new ApiParticipantRepository(apiClient),
    questionRepository: new ApiQuestionRepository(apiClient),
    answerRepository: new ApiAnswerRepository(apiClient),
    tallyRepository: new ApiTallyRepository(apiClient),
    participantScoreRepository: new ApiParticipantScoreRepository(apiClient),
    sessionRepository: new ApiSessionRepository(apiClient),
    realtimeEventRepository: new NoopRealtimeEventRepository(),
  };
};

const createRepositories = (): RepositorySet => {
  if (appConfig.repositoryMode === "api") {
    return createApiRepositories();
  }

  const repositories = createMockRepositories();
  const apiClient = createApiClient();

  return {
    ...repositories,
    roomRepository:
      appConfig.roomRepositoryMode === "api" ? new ApiRoomRepository(apiClient) : repositories.roomRepository,
    participantRepository:
      appConfig.joinRepositoryMode === "api" ? new ApiParticipantRepository(apiClient) : repositories.participantRepository,
  };
};

const repositories = createRepositories();
const hostLoginSessionRepository =
  appConfig.repositoryMode === "api" || appConfig.hostLoginRepositoryMode === "api"
    ? new ApiSessionRepository(createApiClient())
    : repositories.sessionRepository;
const startQuestionRoomRepository =
  appConfig.repositoryMode === "api" || appConfig.startQuestionRepositoryMode === "api"
    ? new ApiRoomRepository(createApiClient())
    : repositories.roomRepository;
const showResultRoomRepository =
  appConfig.repositoryMode === "api" || appConfig.showResultRepositoryMode === "api"
    ? new ApiRoomRepository(createApiClient())
    : repositories.roomRepository;
const sessionValidationRepository =
  appConfig.repositoryMode === "api" || appConfig.sessionRepositoryMode === "api"
    ? new ApiSessionRepository(createApiClient())
    : repositories.sessionRepository;
const submitAnswerRepository =
  appConfig.repositoryMode === "api" || appConfig.submitAnswerRepositoryMode === "api"
    ? new ApiAnswerRepository(createApiClient())
    : repositories.answerRepository;
const rankingParticipantScoreRepository =
  appConfig.repositoryMode === "api" || appConfig.rankingRepositoryMode === "api"
    ? new ApiParticipantScoreRepository(createApiClient())
    : repositories.participantScoreRepository;
const rankingService = new RankingService();
const scoringService = new ScoringService();

export const appDependencies = {
  repositoryMode: appConfig.repositoryMode,
  roomRepositoryMode: appConfig.roomRepositoryMode,
  joinRepositoryMode: appConfig.joinRepositoryMode,
  sessionRepositoryMode: appConfig.sessionRepositoryMode,
  hostLoginRepositoryMode: appConfig.hostLoginRepositoryMode,
  startQuestionRepositoryMode: appConfig.startQuestionRepositoryMode,
  submitAnswerRepositoryMode: appConfig.submitAnswerRepositoryMode,
  showResultRepositoryMode: appConfig.showResultRepositoryMode,
  rankingRepositoryMode: appConfig.rankingRepositoryMode,
  sessionStorageGateway,
  joinParticipantUseCase: new JoinParticipantUseCase(
    repositories.participantRepository,
    repositories.sessionRepository,
  ),
  loginHostUseCase: new LoginHostUseCase(hostLoginSessionRepository),
  validateSessionUseCase: new ValidateSessionUseCase(sessionValidationRepository),
  getRoomStateUseCase: new GetRoomStateUseCase(
    repositories.roomRepository,
    repositories.questionRepository,
    repositories.tallyRepository,
    repositories.participantScoreRepository,
    repositories.answerRepository,
    rankingService,
  ),
  getRankingUseCase: new GetRankingUseCase(rankingParticipantScoreRepository, rankingService),
  submitAnswerUseCase: new SubmitAnswerUseCase(
    repositories.sessionRepository,
    repositories.roomRepository,
    submitAnswerRepository,
    repositories.tallyRepository,
    repositories.realtimeEventRepository,
  ),
  startQuestionUseCase: new StartQuestionUseCase(
    repositories.sessionRepository,
    startQuestionRoomRepository,
    repositories.questionRepository,
    repositories.tallyRepository,
    repositories.realtimeEventRepository,
  ),
  showResultUseCase: new ShowResultUseCase(
    repositories.sessionRepository,
    showResultRoomRepository,
    repositories.questionRepository,
    repositories.answerRepository,
    repositories.participantScoreRepository,
    repositories.realtimeEventRepository,
    scoringService,
    rankingService,
  ),
} as const;
