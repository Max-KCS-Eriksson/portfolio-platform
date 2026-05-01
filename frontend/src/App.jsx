import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { usePageTitle } from "./hooks/usePageTitle";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProjectListPage from "./pages/ProjectListPage";
import { ROUTES } from "./routes/paths";

function TemporaryPage({ title }) {
  usePageTitle(title);
  return <h2>{title}</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={ROUTES.home} element={<HomePage title="Home" />} />
          <Route path={ROUTES.portfolio} element={<ProjectListPage title="Portfolio" />} />
          <Route path={ROUTES.blog} element={<TemporaryPage title="Blog" />} />
          <Route path={ROUTES.about} element={<AboutPage title="About" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
