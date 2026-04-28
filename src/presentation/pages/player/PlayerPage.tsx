import type { ReactElement } from "react";
import { usePlayer } from "./usePlayer";

export function PlayerPage(): ReactElement {
  const { roomState, selectedChoice, canAnswer, message, submitAnswer } = usePlayer();

  return (
    <section className="page-stack">
      <div className="page-heading">
        <p className="page-kicker">/player</p>
        <h2>参加者画面</h2>
        <p>
          問題 {roomState.currentQuestionIndex} / {roomState.question.point}点 / 状態:
          {roomState.status}
        </p>
      </div>
      <div className="question-panel">
        <h3>{roomState.question.text}</h3>
        {roomState.question.choices.length > 0 ? (
          <div className="choice-grid">
            {roomState.question.choices.map((choice) => (
              <button
                className={selectedChoice === choice.key ? "choice-button choice-button--selected" : "choice-button"}
                disabled={!canAnswer}
                key={choice.key}
                onClick={() => submitAnswer(choice.key)}
                type="button"
              >
                <strong>{choice.key}</strong>
                <span>{choice.label}</span>
              </button>
            ))}
          </div>
        ) : null}
        <p className="status-line">
          {selectedChoice ? `回答済み: ${selectedChoice}（再回答不可）` : "未回答です。"}
        </p>
        {roomState.status === "result" ? (
          <p className="status-line">正解: {roomState.question.correctChoice ?? "未設定"}</p>
        ) : null}
        {message ? <p className="status-line">{message}</p> : null}
      </div>
    </section>
  );
}
