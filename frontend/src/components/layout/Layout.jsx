import { Outlet, useLocation } from "react-router-dom";
import { useFrontendContext } from "../../context/useFrontendContext";
import { ROUTES } from "../../routes/paths";
import Header from "./Header";
import Footer from "./Footer";

const wideContentRoutes = [ROUTES.home, ROUTES.portfolio];

function getMainContentClassName(pathname) {
  return wideContentRoutes.includes(pathname) ? "main-content wide-content" : "main-content";
}

function Layout() {
  const location = useLocation();
  const { contextData } = useFrontendContext();

  const domainName = contextData?.domain_name ?? "";
  const userHost = domainName ? `guest@${domainName.toLowerCase()}` : "guest@";
  const mainContentClassName = getMainContentClassName(location.pathname);

  return (
    <>
      <Header />

      <main>
        <h1 className="breadcrumb">
          <span className="user-host">{userHost}</span>:
          <span className="path">~{location.pathname}</span>
        </h1>

        <section className={mainContentClassName}>
          <Outlet />
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Layout;
