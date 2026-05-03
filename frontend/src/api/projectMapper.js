// Helpers

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function asString(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}

// Mappers

function mapTechStack(project) {
  const techStack = project.techStack ?? project.tech_stack;

  if (!Array.isArray(techStack)) {
    return [];
  }

  return techStack
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
    publish: asBoolean(project.publish, true),
    featured: asBoolean(project.featured, false),
    highlighted: asBoolean(project.highlighted, false),
    techStack: mapTechStack(project),
  };
}

export function mapProjects(projects) {
  if (!Array.isArray(projects)) {
    return [];
  }

  return projects.map(mapProject).filter(Boolean);
}
