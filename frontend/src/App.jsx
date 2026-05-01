import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { usePageTitle } from "./hooks/usePageTitle";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import BlogPostListPage from "./pages/BlogPostListPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
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
          <Route path={ROUTES.projectDetail} element={<ProjectDetailPage />} />
          <Route path={ROUTES.blog} element={<BlogPostListPage />} />
          <Route path={ROUTES.blogTag} element={<BlogPostListPage />} />
          <Route path={ROUTES.blogPostDetail} element={<TemporaryPage title="Blog post" />} />
          <Route path={ROUTES.about} element={<AboutPage title="About" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
