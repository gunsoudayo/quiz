import { useEffect, useMemo, useState } from "react";
import { appDependencies } from "../../../app/config/dependencies";
import type { HostSessionDto } from "../../../application/dto/SessionDto";

export function useHostControl(): {
  readonly password: string;
  readonly isLoggedIn: boolean;
  readonly latestAction: string;
  readonly setPassword: (value: string) => void;
  readonly login: () => void;
  readonly startQuestion: (questionIndex: number) => void;
  readonly showResult: () => void;
} {
  const [password, setPassword] = useState("");
  const [hostSession, setHostSession] = useState<HostSessionDto | null>(() =>
    appDependencies.sessionStorageGateway.getHostSession(),
  );
  const [latestAction, setLatestAction] = useState(hostSession ? "進行者として復帰しました。" : "未ログインです。");
  const { loginHostUseCase, sessionStorageGateway, startQuestionUseCase, showResultUseCase } = useMemo(
    () => appDependencies,
    [],
  );

  useEffect(() => {
    const session = hostSession ?? sessionStorageGateway.getHostSession();

    if (!session) {
      return;
    }

    void (async (): Promise<void> => {
      try {
        const validation = await appDependencies.validateSessionUseCase.execute({
          sessionToken: session.sessionToken,
        });

        if (validation.isValid && validation.role === "host") {
          return;
        }
      } catch {
        // Treat validation failures as an expired local session.
      }

      sessionStorageGateway.clearHostSession();
      setHostSession(null);
      setLatestAction("セッションの有効期限が切れました。再ログインしてください。");
    })();
  }, [hostSession, sessionStorageGateway]);

  const login = (): void => {
    void (async (): Promise<void> => {
      try {
        const session = await loginHostUseCase.execute({ password });
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
        const startedRoom = await startQuestionUseCase.execute({
          sessionToken: session.sessionToken,
          roomId: session.roomId,
          questionIndex,
        });
        setLatestAction(`Q${startedRoom.currentQuestionIndex} を開始しました。`);
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
        const result = await showResultUseCase.execute({
          sessionToken: session.sessionToken,
          roomId: session.roomId,
        });
        setLatestAction(
          result.correctChoice ? `正解 ${result.correctChoice} を表示しました。` : "正解表示と採点を実行しました。",
        );
      } catch (error) {
        setLatestAction(error instanceof Error ? error.message : "正解表示に失敗しました。");
      }
    })();
  };

  return {
    password,
    isLoggedIn: hostSession !== null,
    latestAction,
    setPassword,
    login,
    startQuestion,
    showResult,
  };
}
