import { BrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import AppRouter from "./router/AppRouter";
import { appRoutes } from "./router/routes";

export default function App() {
  return (
    <BrowserRouter>
      <Layout
        matchMakerPath={appRoutes.matchmaker}
        overviewPath={appRoutes.overview}
        pokedexPath={appRoutes.pokedex}
      >
        <AppRouter />
      </Layout>
    </BrowserRouter>
  );
}
