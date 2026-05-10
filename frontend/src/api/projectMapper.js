import { asArray, asBoolean, asNumber, asString, isObject } from "./mapperUtils";

function mapTechStack(project) {
  const techStack = project.techStack ?? project.tech_stack;

  return asArray(techStack)
    .map((tech) => {
      if (typeof tech === "string") {
        return tech;
      }

      if (isObject(tech)) {
        return asString(tech.name);
      }

      return "";
    })
    .filter(Boolean);
}

export function mapProject(project) {
  if (!isObject(project)) {
    return null;
  }

  return {
    id: project.id ?? null,
    title: asString(project.title),
    repoUrl: asString(project.repo_url ?? project.repoUrl),
    liveUrl: asString(project.live_url ?? project.liveUrl),
    description: asString(project.summary ?? project.description),
    problem: asString(project.problem, "Project problem TBD"),
    solution: asString(project.solution, "Project solution TBD"),
    techChoices: asString(project.tech_choices ?? project.techChoices, "Project tech choices TBD"),
    competenciesDemonstrated: asString(
      project.competencies_demonstrated ?? project.competenciesDemonstrated,
      "Project competencies demonstrated TBD",
    ),
    projectVisual: asString(project.project_visual ?? project.projectVisual),
    projectVisualCaption: asString(project.project_visual_caption ?? project.projectVisualCaption),
    thumbnail: asString(project.thumbnail),
    thumbnailCaption: asString(project.thumbnail_caption ?? project.thumbnailCaption),
    slug: asString(project.slug),
    featured: asBoolean(project.featured, false),
    highlighted: asBoolean(project.highlighted, false),
    displayOrder: asNumber(project.display_order ?? project.displayOrder),
    techStack: mapTechStack(project),
  };
}

export function mapProjects(projects) {
  return asArray(projects).map(mapProject).filter(Boolean);
}

export function mapPortfolioContext(portfolioContext) {
  if (!isObject(portfolioContext)) {
    return null;
  }

  return {
    id: portfolioContext.id ?? null,
    intro: asString(portfolioContext.intro),
  };
}
