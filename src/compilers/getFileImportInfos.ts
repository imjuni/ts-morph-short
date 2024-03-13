import { getDefaultImport } from '#/compilers/getDefaultImport';
import { getNamedImport } from '#/compilers/getNamedImport';
import type { IImportInfo } from '#/compilers/interfaces/IImportInfo';
import type * as tsm from 'ts-morph';

export function getFileImportInfos(project: tsm.Project, sourceFilePath: string): IImportInfo[] {
  const sourceFile = project.getSourceFileOrThrow(sourceFilePath);
  const importDeclarations = sourceFile.getImportDeclarations();

  const importInfos = importDeclarations
    .map((importDeclaration) => {
      const moduleSourceFile = importDeclaration.getModuleSpecifierSourceFile();
      const importClause = importDeclaration.getImportClause();
      const defaultImport = importClause?.getDefaultImport();

      // 01. default import case
      const defaultImports =
        defaultImport != null ? getDefaultImport(defaultImport, sourceFile, moduleSourceFile) : [];

      // 02. named import case
      const namedImports =
        importClause != null ? getNamedImport(importClause, sourceFile, moduleSourceFile) : [];

      return [
        // 01. default import case
        ...defaultImports,
        // 02. named import case
        ...namedImports,
      ];
    })
    .flat();

  return importInfos;
}
