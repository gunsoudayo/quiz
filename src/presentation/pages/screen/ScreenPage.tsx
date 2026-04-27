import type { ReactElement } from "react";
import { useRoomState } from "../../hooks/useRoomState";

export function ScreenPage(): ReactElement {
  const { roomState, refreshRoomState } = useRoomState();

  return (
    <section className="screen-layout">
      <div className="page-heading screen-layout__heading">
        <p className="page-kicker">/screen</p>
        <h2>全体表示画面</h2>
        <p>回答状況、正解、ランキングを表示します。</p>
      </div>
      <div className="question-panel screen-layout__question">
        <div className="screen-title-row">
          <h3>{roomState.question.text}</h3>
          <button className="secondary-button" onClick={refreshRoomState} type="button">
            更新
          </button>
        </div>
        <div className="tally-list">
          {roomState.question.choices.map((choice) => (
            <div className="tally-row" key={choice.key}>
              <span className="tally-row__choice">{choice.key}</span>
              <span className="tally-row__label">{choice.label}</span>
              <strong>{roomState.tally[choice.key]}票</strong>
            </div>
          ))}
        </div>
      </div>
      <section className="result-panel">
        <h3>正解表示</h3>
        <p>
          {roomState.status === "result"
            ? `正解: ${roomState.question.correctChoice ?? "未設定"}`
            : "締切後に正解を表示します。"}
        </p>
      </section>
      <section className="ranking-panel">
        <h3>ランキング</h3>
        <ol className="ranking-list">
          {roomState.ranking.map((item) => (
            <li className="ranking-row" key={`${item.rank}-${item.participantName}`}>
              <span>{item.rank}位</span>
              <strong>{item.participantName}</strong>
              <span>{item.correctCount}問正解</span>
              <span>{item.totalScore}点</span>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
