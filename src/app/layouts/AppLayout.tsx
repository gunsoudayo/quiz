import type { ReactElement } from "react";
import { NavLink, Outlet } from "react-router-dom";

const navigationItems = [
  { to: "/join", label: "参加" },
  { to: "/player", label: "回答" },
  { to: "/screen", label: "全体表示" },
  { to: "/host", label: "進行" },
] as const;

export function AppLayout(): ReactElement {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">Recreation Quiz</p>
          <h1>会社レクリエーションクイズ</h1>
        </div>
        <nav className="app-nav" aria-label="画面切り替え">
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? "app-nav__link app-nav__link--active" : "app-nav__link"
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
