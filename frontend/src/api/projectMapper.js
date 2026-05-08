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
    title: asString(project.title, "Project title TBD"),
    repo_url: asString(project.repo_url ?? project.repoUrl),
    live_url: asString(project.live_url ?? project.liveUrl),
    summary: asString(project.summary, "Project summary TBD"),
    description: asString(project.description, "Project description TBD"),
    slug: asString(project.slug),
    featured: asBoolean(project.featured, false),
    highlighted: asBoolean(project.highlighted, false),
    display_order: asNumber(project.display_order ?? project.displayOrder),
    techStack: mapTechStack(project),
  };
}

export function mapProjects(projects) {
  return asArray(projects).map(mapProject).filter(Boolean);
}
