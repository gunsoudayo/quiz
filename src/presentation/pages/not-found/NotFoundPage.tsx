import type { ReactElement } from "react";
import { Link } from "react-router-dom";

export function NotFoundPage(): ReactElement {
  return (
    <section className="page-stack">
      <div className="page-heading">
        <p className="page-kicker">404</p>
        <h2>ページが見つかりません</h2>
        <p>指定された画面はまだ定義されていません。</p>
      </div>
      <Link className="primary-button primary-button--link" to="/join">
        参加画面へ戻る
      </Link>
    </section>
  );
}
