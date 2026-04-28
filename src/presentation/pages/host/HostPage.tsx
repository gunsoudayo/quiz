import type { FormEvent, ReactElement } from "react";
import { useHostControl } from "./useHostControl";

const questionButtons = [1, 2] as const;

export function HostPage(): ReactElement {
  const {
    adminPassword,
    isLoggedIn,
    latestAction,
    setAdminPassword,
    login,
    startQuestion,
    showResult,
  } = useHostControl();

  const handleLogin = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    login();
  };

  return (
    <section className="page-stack">
      <div className="page-heading">
        <p className="page-kicker">/host</p>
        <h2>進行者画面</h2>
        <p>管理用パスワードでログインし、問題開始と正解表示を操作します。</p>
      </div>
      <form className="form-panel" onSubmit={handleLogin}>
        <label className="field">
          <span>管理用パスワード</span>
          <input
            autoComplete="current-password"
            onChange={(event) => setAdminPassword(event.target.value)}
            required
            type="password"
            value={adminPassword}
          />
        </label>
        <button className="primary-button" type="submit">
          進行者ログイン
        </button>
      </form>
      <div className="host-controls" aria-disabled={!isLoggedIn}>
        <div>
          <h3>問題番号</h3>
          <div className="host-button-row">
            {questionButtons.map((questionIndex) => (
              <button
                className="secondary-button"
                disabled={!isLoggedIn}
                key={questionIndex}
                onClick={() => startQuestion(questionIndex)}
                type="button"
              >
                Q{questionIndex}
              </button>
            ))}
          </div>
        </div>
        <button className="primary-button" disabled={!isLoggedIn} onClick={showResult} type="button">
          正解を表示
        </button>
      </div>
      <p className="status-line">{latestAction}</p>
    </section>
  );
}
