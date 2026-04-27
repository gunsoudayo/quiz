import { useMemo, useState } from "react";
import { LoginHostUseCase } from "../../../application/usecases/LoginHostUseCase";
import { SessionStorageGateway } from "../../../infrastructure/storage/SessionStorageGateway";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [latestAction, setLatestAction] = useState("未ログインです。");
  const loginHostUseCase = useMemo(() => new LoginHostUseCase(), []);
  const sessionStorageGateway = useMemo(() => new SessionStorageGateway(), []);

  const login = (): void => {
    const session = loginHostUseCase.execute({ adminPassword });
    sessionStorageGateway.saveHostSession(session);
    setIsLoggedIn(true);
    setLatestAction("進行者としてログインしました。");
  };

  const startQuestion = (questionIndex: number): void => {
    // TODO: StartQuestionUseCase 経由で rooms.status=open と tallies 初期化を行う。
    setLatestAction(`Q${questionIndex} を開始しました（モック）。`);
  };

  const showResult = (): void => {
    // TODO: ShowResultUseCase 経由で rooms.status=result と採点処理を行う。
    setLatestAction("正解表示を実行しました（モック）。");
  };

  return {
    adminPassword,
    isLoggedIn,
    latestAction,
    setAdminPassword,
    login,
    startQuestion,
    showResult,
  };
}
