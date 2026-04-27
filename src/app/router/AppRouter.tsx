import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { HostPage } from "../../presentation/pages/host/HostPage";
import { JoinPage } from "../../presentation/pages/join/JoinPage";
import { NotFoundPage } from "../../presentation/pages/not-found/NotFoundPage";
import { PlayerPage } from "../../presentation/pages/player/PlayerPage";
import { ScreenPage } from "../../presentation/pages/screen/ScreenPage";

export function AppRouter(): ReactElement {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/join" replace />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/player" element={<PlayerPage />} />
        <Route path="/screen" element={<ScreenPage />} />
        <Route path="/host" element={<HostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
