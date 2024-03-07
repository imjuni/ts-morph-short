import { getDefaultImport } from '#/compilers/getDefaultImport';
import { getFileImportInfoMapKey } from '#/compilers/getFileImportInfoMapKey';
import { getNamedImport } from '#/compilers/getNamedImport';
import type { IFileImportInfo } from '#/compilers/interfaces/IFileImportInfo';
import type * as tsm from 'ts-morph';

export function getFileImportInfoMap(project: tsm.Project): Map<string, IFileImportInfo> {
  const filePaths = project
    .getSourceFiles()
    .map((sourceFile) => sourceFile.getFilePath().toString());

  const map = new Map<string, IFileImportInfo>(
    filePaths
      .map<[string, IFileImportInfo][]>((filePath) => {
        const sourceFile = project.getSourceFileOrThrow(filePath);
        const importDeclarations = sourceFile.getImportDeclarations();

        const importInfos = importDeclarations
          .map((importDeclaration) => {
            const moduleSourceFile = importDeclaration.getModuleSpecifierSourceFile();
            const importClause = importDeclaration.getImportClause();
            const defaultImport = importClause?.getDefaultImport();

            // 01. default import case
            const defaultImports =
              defaultImport != null
                ? getDefaultImport(defaultImport, sourceFile, moduleSourceFile)
                : [];

            // 02. named import case
            const namedImports =
              importClause != null
                ? getNamedImport(importClause, sourceFile, moduleSourceFile)
                : [];

            return [
              // 01. default import case
              ...defaultImports,
              // 02. named import case
              ...namedImports,
            ];
          })
          .flat();

        return importInfos.map((importInfo) => {
          return [getFileImportInfoMapKey(importInfo), importInfo];
        });
      })
      .flat(),
  );

  return map;
}
