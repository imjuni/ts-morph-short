import * as tsm from 'ts-morph';

export default async function getTsProject(
  tsconfigPath: string,
  compilerOptions?: tsm.ts.CompilerOptions,
) {
  const project = new tsm.Project({ tsConfigFilePath: tsconfigPath, compilerOptions });
  return project;
}
