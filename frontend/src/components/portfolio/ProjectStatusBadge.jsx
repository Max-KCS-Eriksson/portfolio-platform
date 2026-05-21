import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faFlask, faPersonDigging } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ProjectStatusBadge.css";

/**
 * Render a compact project status badge.
 *
 * @param {object} props
 * @param {boolean} [props.featured]
 * When true, renders the Featured label with a star icon.
 * @param {"prototype"|"beta"|"stable"} [props.status]
 * Project lifecycle status. Renders non-stable statuses as badges.
 * @param {string} [props.className]
 * Optional placement-specific class names.
 */
function ProjectStatusBadge({ featured = false, status = "stable", className = "" }) {
  if (!featured && status === "stable") {
    return null;
  }

  const badgeStatus = featured ? "featured" : status;
  const label = featured ? "Featured" : status.toUpperCase();
  const icon = featured ? faStar : status === "prototype" ? faFlask : faPersonDigging;
  const classNames = ["project-status-badge", badgeStatus, className].filter(Boolean).join(" ");

  return (
    <span className={classNames}>
      <FontAwesomeIcon icon={icon} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export default ProjectStatusBadge;
