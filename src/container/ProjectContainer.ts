import type * as tsm from 'ts-morph';

export class ProjectContainer {
  static #it: ProjectContainer;

  static #isBootstrap: boolean = false;

  static get it(): Readonly<ProjectContainer> {
    return ProjectContainer.#it;
  }

  static bootstrap(
    options: Record<string, { project: tsm.Project; config: tsm.ts.ParsedCommandLine }>,
  ) {
    if (ProjectContainer.#isBootstrap) {
      return;
    }

    ProjectContainer.#it = new ProjectContainer(options);
    ProjectContainer.#isBootstrap = true;
  }

  #projects: Map<string, { project: tsm.Project; config: tsm.ts.ParsedCommandLine }>;

  constructor(
    projects: Record<string, { project: tsm.Project; config: tsm.ts.ParsedCommandLine }>,
  ) {
    this.#projects = new Map<string, { project: tsm.Project; config: tsm.ts.ParsedCommandLine }>(
      Object.entries(projects),
    );
  }

  get projects(): Readonly<
    Map<string, { project: tsm.Project; config: tsm.ts.ParsedCommandLine }>
  > {
    return this.#projects;
  }

  project(key: string): { project: tsm.Project; config: tsm.ts.ParsedCommandLine } {
    const project = this.#projects.get(key);

    if (project == null) {
      throw new Error(`Cannot found project: ${key}`);
    }

    return project;
  }
}
