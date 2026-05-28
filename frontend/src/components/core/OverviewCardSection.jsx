import { Children } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getProjectOverviewLayoutGroupSize } from "../../config/overviewLimits";
import "./OverviewCardSection.css";

function getOverviewCardListClassName({ itemCount, featured = false, secondary = false, className = "" }) {
  const layoutGroupSize = getProjectOverviewLayoutGroupSize();
  const usesFeaturedSingleLayout = featured && itemCount === 1;
  const usesFeaturedPairedLayout = featured && itemCount === 2;
  const usesFeaturedLeadLayout = featured && itemCount === layoutGroupSize;
  const usesSecondaryPairedLayout = !featured && itemCount % 2 === 0 && itemCount % layoutGroupSize !== 0;
  const usesSecondaryFifthsLayout = !featured && itemCount % 5 === 0 && itemCount % 2 !== 0;
  const usesStackLayout = itemCount < layoutGroupSize;

  return [
    "overview-card-section__list",
    className,
    secondary ? "secondary" : "",
    usesFeaturedSingleLayout ? "layout-single" : "",
    usesFeaturedPairedLayout || usesSecondaryPairedLayout ? "layout-paired" : "",
    usesFeaturedLeadLayout ? "layout-lead" : "",
    usesSecondaryFifthsLayout ? "layout-fifths" : "",
    usesStackLayout ? "layout-stack" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Render a titled overview section with responsive card-list layout.
 *
 * @param {object} props
 * @param {string} props.id
 * Stable section id. The component also derives the heading id from this value,
 * so each page should pass a unique domain name such as `featured-projects`.
 * @param {string} props.heading
 * Visible heading rendered above the list. This should describe the cards,
 * for example `Featured Projects`, `Other Projects`, or `All Posts`.
 * @param {number} props.itemCount
 * Total number of cards being rendered. The shared layout logic uses this to
 * choose single, paired, lead, fifths, or stacked responsive variants.
 * @param {string} [props.className]
 * Optional class added to the outer section when a page needs a stable
 * domain-specific hook, such as `blog-posts-section`.
 * @param {string} [props.listClassName]
 * Optional class added to the `ul` so an existing feature can keep its public
 * selectors while sharing the common overview layout.
 * @param {string} [props.itemClassName]
 * Optional class added to every generated `li` for card-specific sizing or
 * alignment hooks.
 * @param {boolean} [props.featured]
 * Use true for featured/primary overview sections; enables the lead-card layout
 * used by the portfolio featured section.
 * @param {boolean} [props.secondary]
 * Use true for secondary overview lists; applies the same responsive density as
 * the portfolio `Other Projects` section.
 * @param {string} [props.linkHref]
 * Route for an optional section-level CTA. Omit or leave empty when no heading
 * action should be shown.
 * @param {string} [props.linkText]
 * Label for the optional section-level CTA. Both `linkHref` and `linkText` are
 * required for the link to render.
 * @param {import("react").ReactNode} props.children
 * Card components. The component wraps each child in a list item, so callers
 * should pass cards directly rather than pre-wrapped `li` elements.
 */
function OverviewCardSection({
  id,
  heading,
  itemCount,
  className = "",
  listClassName = "",
  itemClassName = "",
  featured = false,
  secondary = false,
  linkHref = "",
  linkText = "",
  children,
}) {
  const headingId = `${id}-heading`;
  const sectionClassName = ["overview-card-section", className].filter(Boolean).join(" ");
  const childrenArray = Children.toArray(children);

  return (
    <section className={sectionClassName} aria-labelledby={headingId} id={id}>
      <div className="overview-card-section__header">
        <h2 id={headingId}>{heading}</h2>
        {linkHref && linkText && (
          <Link className="overview-card-section__link" to={linkHref}>
            <span>{linkText}</span>
            <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </Link>
        )}
      </div>

      <ul className={getOverviewCardListClassName({ itemCount, featured, secondary, className: listClassName })}>
        {childrenArray.map((child) => (
          <li className={["overview-card-section__item", itemClassName].filter(Boolean).join(" ")} key={child.key}>
            {child}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default OverviewCardSection;
