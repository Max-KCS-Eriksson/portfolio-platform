import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { usePageTitle } from "./hooks/usePageTitle";
import HomePage from "./pages/HomePage";

function TemporaryPage({ title }) {
  usePageTitle(title);
  return <h2>{title}</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage title="Home" />} />
          <Route path="/portfolio/" element={<TemporaryPage title="Portfolio" />} />
          <Route path="/blog/" element={<TemporaryPage title="Blog" />} />
          <Route path="/about/" element={<TemporaryPage title="About" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
