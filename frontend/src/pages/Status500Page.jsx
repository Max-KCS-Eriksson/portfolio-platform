import { usePageTitle } from "../hooks/usePageTitle";

function Status500Page() {
  usePageTitle("");

  return (
    <>
      <h1 className="title">There has been an internal error</h1>
      <p className="summary">500</p>
    </>
  );
}

export default Status500Page;
