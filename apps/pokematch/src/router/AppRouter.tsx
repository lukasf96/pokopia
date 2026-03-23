import { Navigate, Route, Routes } from "react-router-dom";
import MatcherPage from "../pages/MatchMaker/MatcherPage";
import OverviewPage from "../pages/Overview/OverviewPage";
import PokedexPage from "../pages/Pokedex/PokedexPage";
import { appRoutes } from "./routes";

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={appRoutes.matchmaker} replace />}
      />
      <Route path={appRoutes.matchmaker} element={<MatcherPage />} />
      <Route path={appRoutes.overview} element={<OverviewPage />} />
      <Route path={appRoutes.pokedex} element={<PokedexPage />} />
      <Route
        path="*"
        element={<Navigate to={appRoutes.matchmaker} replace />}
      />
    </Routes>
  );
}
