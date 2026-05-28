import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faCopy } from "@fortawesome/free-regular-svg-icons";
import { renderLinebreaks } from "../../utils/renderLinebreaks";
import "./CodeSnippet.css";

async function copyText(text) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function CodeSnippet({ heading = "", code, description = "" }) {
  const [isCopied, setIsCopied] = useState(false);
  const copiedTimeoutRef = useRef(null);

  useEffect(
    () => () => {
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    },
    [],
  );

  async function handleCopy() {
    await copyText(code);
    setIsCopied(true);

    if (copiedTimeoutRef.current) {
      window.clearTimeout(copiedTimeoutRef.current);
    }

    copiedTimeoutRef.current = window.setTimeout(() => {
      setIsCopied(false);
    }, 800);
  }

  return (
    <section className="code-snippet">
      {heading && <h3 className="code-snippet__heading">{heading}</h3>}

      <div className="code-snippet__code-wrap">
        <pre className={`code-snippet__box ${isCopied ? "copied" : ""}`}>
          <code className="code-snippet__code">
            <span className="code-snippet__text">{code}</span>
          </code>
        </pre>
        <button className="code-snippet__copy" type="button" aria-label="Copy snippet" onClick={handleCopy}>
          <FontAwesomeIcon icon={faCopy} aria-hidden="true" />
        </button>
      </div>

      {description && (
        <div className="code-snippet__description">
          <span className="code-snippet__description-icon" aria-hidden="true">
            <FontAwesomeIcon icon={faComment} />
          </span>
          <div className="code-snippet__description-body">{renderLinebreaks(description)}</div>
        </div>
      )}
    </section>
  );
}

export default CodeSnippet;
