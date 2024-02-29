import * as tsm from 'ts-morph';

export async function getTypeScriptProject(
  tsconfigPath: string,
  compilerOptions?: tsm.ts.CompilerOptions,
) {
  const project = new tsm.Project({ tsConfigFilePath: tsconfigPath, compilerOptions });
  return project;
}
