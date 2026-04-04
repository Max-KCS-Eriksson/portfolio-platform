import { Outlet } from "react-router-dom";
import Header from "./core/components/Header";
import Footer from "./core/components/Footer";

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
