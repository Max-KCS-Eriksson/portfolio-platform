import "./NumberedHeading.css";

/**
 * Render a section heading with a numeric marker and heading text.
 *
 * @param {object} props
 * @param {string} props.marker
 * Number marker rendered before the title, for example `01`.
 * @param {string} props.id
 * Heading id used by the surrounding section for `aria-labelledby`.
 * @param {string} [props.className]
 * Optional class added to the heading root.
 * @param {string} [props.ariaLabel]
 * Optional accessible heading name when it should differ from the visible text.
 * @param {import("react").ReactNode} [props.actions]
 * Optional trailing heading content such as a status badge.
 * @param {import("react").ReactNode} props.children
 * Heading title content rendered after the marker.
 */
function NumberedHeading({ marker, id, className = "", ariaLabel = undefined, actions = null, children }) {
  const headingLabel = ariaLabel ?? (typeof children === "string" ? `${marker} ${children}` : undefined);

  return (
    <h2 className={["numbered-heading", className].filter(Boolean).join(" ")} id={id} aria-label={headingLabel}>
      <span className="numbered-heading__marker">{marker}</span>
      <span className="numbered-heading__title">{children}</span>
      {actions && <span className="numbered-heading__actions">{actions}</span>}
    </h2>
  );
}

export default NumberedHeading;
