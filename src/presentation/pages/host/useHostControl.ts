import { useMemo, useState } from "react";
import { appDependencies } from "../../../app/config/dependencies";
import type { HostSessionDto } from "../../../application/dto/SessionDto";

export function useHostControl(): {
  readonly adminPassword: string;
  readonly isLoggedIn: boolean;
  readonly latestAction: string;
  readonly setAdminPassword: (value: string) => void;
  readonly login: () => void;
  readonly startQuestion: (questionIndex: number) => void;
  readonly showResult: () => void;
} {
  const [adminPassword, setAdminPassword] = useState("");
  const [hostSession, setHostSession] = useState<HostSessionDto | null>(() =>
    appDependencies.sessionStorageGateway.getHostSession(),
  );
  const [latestAction, setLatestAction] = useState(hostSession ? "進行者として復帰しました。" : "未ログインです。");
  const { loginHostUseCase, sessionStorageGateway, startQuestionUseCase, showResultUseCase } = useMemo(
    () => appDependencies,
    [],
  );

  const login = (): void => {
    void (async (): Promise<void> => {
      try {
        const session = await loginHostUseCase.execute({ adminPassword });
        sessionStorageGateway.saveHostSession(session);
        setHostSession(session);
        setLatestAction("進行者としてログインしました。");
      } catch (error) {
        setLatestAction(error instanceof Error ? error.message : "進行者ログインに失敗しました。");
      }
    })();
  };

  const startQuestion = (questionIndex: number): void => {
    const session = hostSession ?? sessionStorageGateway.getHostSession();

    if (!session) {
      setLatestAction("進行者ログインが必要です。");
      return;
    }

    void (async (): Promise<void> => {
      try {
        await startQuestionUseCase.execute({
          sessionToken: session.sessionToken,
          roomId: session.roomId,
          questionIndex,
        });
        setLatestAction(`Q${questionIndex} を開始しました。`);
      } catch (error) {
        setLatestAction(error instanceof Error ? error.message : "問題開始に失敗しました。");
      }
    })();
  };

  const showResult = (): void => {
    const session = hostSession ?? sessionStorageGateway.getHostSession();

    if (!session) {
      setLatestAction("進行者ログインが必要です。");
      return;
    }

    void (async (): Promise<void> => {
      try {
        await showResultUseCase.execute({
          sessionToken: session.sessionToken,
          roomId: session.roomId,
        });
        setLatestAction("正解表示と採点を実行しました。");
      } catch (error) {
        setLatestAction(error instanceof Error ? error.message : "正解表示に失敗しました。");
      }
    })();
  };

  return {
    adminPassword,
    isLoggedIn: hostSession !== null,
    latestAction,
    setAdminPassword,
    login,
    startQuestion,
    showResult,
  };
}
