import { Outlet, useLocation } from "react-router-dom";
import { useCoreContext } from "../../context/useCoreContext";
import { ROUTES } from "../../routes/paths";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  const location = useLocation();
  const { coreContext } = useCoreContext();

  const domainName = coreContext?.domainName ?? "";
  const userHost = domainName ? `guest@${domainName.toLowerCase()}` : "guest@";

  return (
    <>
      <Header />

      <main>
        <h1 className="breadcrumb">
          <span className="user-host">{userHost}</span>:<span className="path">~{location.pathname}</span>
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
