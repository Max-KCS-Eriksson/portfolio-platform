import { asArray, asOptionalNumber, asString, isObject } from "./mapperUtils";

export function mapHero(heroSection) {
  if (!isObject(heroSection)) {
    return {};
  }

  return {
    id: heroSection.id ?? null,
    headline: asString(heroSection.headline),
    intro: asString(heroSection.intro),
    skills: asArray(heroSection.skills)
      .map((skill) => asString(skill))
      .filter(Boolean),
  };
}

export function mapAbout(aboutPage) {
  if (!isObject(aboutPage)) {
    return {};
  }

  return {
    id: aboutPage.id ?? null,
    intro: asString(aboutPage.intro ?? aboutPage.text),
    background: asString(aboutPage.background),
    mindsetIntro: asString(aboutPage.mindset_intro ?? aboutPage.mindsetIntro),
    mindsetList: asArray(aboutPage.mindset_list ?? aboutPage.mindsetList)
      .map((mindsetListItem) => asString(mindsetListItem))
      .filter(Boolean),
    focusIntro: asString(aboutPage.focus_intro ?? aboutPage.focusIntro),
    focusList: asArray(aboutPage.focus_list ?? aboutPage.focusList)
      .map((focusListItem) => asString(focusListItem))
      .filter(Boolean),
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

export function mapContextData(contextData) {
  if (!isObject(contextData)) {
    return {};
  }

  return {
    domainName: asString(contextData.domain_name ?? contextData.domainName),
    siteOwner: asString(contextData.site_owner ?? contextData.siteOwner),
    socialMediaLinks: mapSocialMediaLinks(contextData.social_media_links ?? contextData.socialMediaLinks),
    projectOverviewLimit: asOptionalNumber(contextData.project_overview_limit ?? contextData.projectOverviewLimit),
    blogOverviewLimit: asOptionalNumber(contextData.blog_overview_limit ?? contextData.blogOverviewLimit),
  };
}
