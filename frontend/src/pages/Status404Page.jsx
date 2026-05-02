import { usePageTitle } from "../hooks/usePageTitle";

function Status404Page() {
  usePageTitle("");

  return (
    <>
      <h1 className="title">Requested page can't be found</h1>
      <p className="summary">404</p>
    </>
  );
}

export default Status404Page;
