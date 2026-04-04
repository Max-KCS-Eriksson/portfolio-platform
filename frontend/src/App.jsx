import { Route, Routes } from "react-router-dom";

import "./App.css";
import Layout from "./Layout";
import Home from "./core/Home";
import Portfolio from "./portfolio/Portfolio";
import Blog from "./blog/Blog";
import About from "./core/About";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="portfolio/" element={<Portfolio />} />
        <Route path="blog/" element={<Blog />} />
        <Route path="about/" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
