import { Route, Routes } from "react-router-dom";

import "./App.css";
import Layout from "./Layout";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}></Route>
    </Routes>
  );
}

export default App;
