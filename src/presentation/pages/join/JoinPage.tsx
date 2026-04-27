import type { FormEvent, ReactElement } from "react";
import { useJoin } from "./useJoin";

export function JoinPage(): ReactElement {
  const { participantName, joinPassword, setParticipantName, setJoinPassword, join } = useJoin();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    join();
  };

  return (
    <section className="page-stack">
      <div className="page-heading">
        <p className="page-kicker">/join</p>
        <h2>参加者ログイン</h2>
        <p>名前と参加用共通パスワードで参加します。</p>
      </div>
      <form className="form-panel" onSubmit={handleSubmit}>
        <label className="field">
          <span>名前</span>
          <input
            autoComplete="name"
            onChange={(event) => setParticipantName(event.target.value)}
            placeholder="例: 田中"
            required
            type="text"
            value={participantName}
          />
        </label>
        <label className="field">
          <span>参加用パスワード</span>
          <input
            autoComplete="current-password"
            onChange={(event) => setJoinPassword(event.target.value)}
            required
            type="password"
            value={joinPassword}
          />
        </label>
        <button className="primary-button" type="submit">
          参加する
        </button>
      </form>
    </section>
  );
}
