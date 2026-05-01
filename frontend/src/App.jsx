import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import BlogPostListPage from "./pages/BlogPostListPage";
import BlogPostDetailPage from "./pages/BlogPostDetailPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectListPage from "./pages/ProjectListPage";
import { ROUTES } from "./routes/paths";

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
          <Route path={ROUTES.blogPostDetail} element={<BlogPostDetailPage />} />
          <Route path={ROUTES.about} element={<AboutPage title="About" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
