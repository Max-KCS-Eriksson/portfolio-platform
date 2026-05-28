import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import BlogOverviewPage from "./pages/BlogOverviewPage";
import ProjectPage from "./pages/ProjectPage";
import PortfolioPage from "./pages/PortfolioPage";
import Status404Page from "./pages/Status404Page";
import Status500Page from "./pages/Status500Page";
import { ROUTES } from "./routes/paths";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.portfolio} element={<PortfolioPage />} />
          <Route path={ROUTES.portfolioFeatured} element={<PortfolioPage featured={true} />} />
          <Route path={ROUTES.portfolioProjects} element={<PortfolioPage featured={false} />} />
          <Route path={ROUTES.projectDetail} element={<ProjectPage />} />
          <Route path={ROUTES.blog} element={<BlogOverviewPage />} />
          <Route path={ROUTES.blogTag} element={<BlogOverviewPage />} />
          <Route path={ROUTES.about} element={<AboutPage />} />
          <Route path={ROUTES.status500} element={<Status500Page />} />
          <Route path={ROUTES.notFound} element={<Status404Page />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
