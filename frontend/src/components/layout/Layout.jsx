import { Outlet, useLocation } from "react-router-dom";
import { useFrontendContext } from "../../context/useFrontendContext";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  const location = useLocation();
  const { contextData } = useFrontendContext();

  const domainName = contextData?.domain_name ?? "";
  const userHost = domainName ? `guest@${domainName.toLowerCase()}` : "guest@";

  return (
    <>
      <Header />

      <main>
        <h1 className="breadcrumb">
          <span className="user-host">{userHost}</span>:
          <span className="path">~{location.pathname}</span>
        </h1>

        <section className="main-content">
          <Outlet />
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Layout;
