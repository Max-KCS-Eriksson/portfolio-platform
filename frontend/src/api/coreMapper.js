import { asArray, asOptionalNumber, asString, isObject } from "./mapperUtils";

export function mapAboutPage(aboutPage) {
  if (!isObject(aboutPage)) {
    return {};
  }

  return {
    id: aboutPage.id ?? null,
    text: asString(aboutPage.text),
  };
}

function mapSocialMediaLink(socialMediaLink) {
  if (!isObject(socialMediaLink)) {
    return null;
  }

  return {
    id: socialMediaLink.id ?? null,
    socialMedia: asString(socialMediaLink.social_media ?? socialMediaLink.socialMedia),
    url: asString(socialMediaLink.url),
  };
}

function mapSocialMediaLinks(socialMediaLinks) {
  return asArray(socialMediaLinks).map(mapSocialMediaLink).filter(Boolean);
}

export function mapFrontendContext(contextData) {
  if (!isObject(contextData)) {
    return {};
  }

  return {
    domainName: asString(contextData.domain_name ?? contextData.domainName),
    siteOwner: asString(contextData.site_owner ?? contextData.siteOwner),
    socialMediaLinks: mapSocialMediaLinks(
      contextData.social_media_links ?? contextData.socialMediaLinks,
    ),
    home: contextData.home,
    projectOverviewLimit: asOptionalNumber(
      contextData.project_overview_limit ?? contextData.projectOverviewLimit,
    ),
    blogOverviewLimit: asOptionalNumber(
      contextData.blog_overview_limit ?? contextData.blogOverviewLimit,
    ),
  };
}
