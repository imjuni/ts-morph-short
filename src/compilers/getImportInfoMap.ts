import { convertImportInfoToElement } from '#/compilers/convertImportInfoToElement';
import { dedupeImportInfo } from '#/compilers/dedupeImportInfo';
import { getDefaultImport } from '#/compilers/getDefaultImport';
import { getDependencyInfoMapKey } from '#/compilers/getDependencyInfoMapKey';
import { getNamedImport } from '#/compilers/getNamedImport';
import type { IDependencyInfo } from '#/compilers/interfaces/IDependencyInfo';
import type { IImportInfoMapElement } from '#/compilers/interfaces/IImportInfoMapElement';
import { mergeImportInfo } from '#/compilers/mergeImportInfo';
import type * as tsm from 'ts-morph';

function getSourceFilePaths(dependencyInfo: IDependencyInfo): string[] {
  if (dependencyInfo.children == null) {
    return [getDependencyInfoMapKey(dependencyInfo)];
  }

  if (dependencyInfo.children.length <= 0) {
    return [getDependencyInfoMapKey(dependencyInfo)];
  }

  const keys = getDependencyInfoMapKey(dependencyInfo);

  return Array.from(
    new Set<string>([
      keys,
      ...dependencyInfo.children.map((child) => getSourceFilePaths(child)).flat(),
    ]),
  );
}

export function getImportInfoMap(project: tsm.Project): Map<string, IImportInfoMapElement> {
  const filePaths = project
    .getSourceFiles()
    .map((sourceFile) => sourceFile.getFilePath().toString());

  const dependencyInfoMap = new Map<string, IDependencyInfo>();

  const duplicatableImportInfos = filePaths
    .map((filePath) => {
      const sourceFile = project.getSourceFileOrThrow(filePath);
      const importStatements = sourceFile.getImportDeclarations();

      const importDeclarations = importStatements
        .map((importDeclaration) => {
          const moduleSourceFile = importDeclaration.getModuleSpecifierSourceFile();
          const importClause = importDeclaration.getImportClause();
          const defaultImport = importClause?.getDefaultImport();

          // 01. default import case
          const defaultImports =
            defaultImport != null
              ? (getDefaultImport(defaultImport, sourceFile, moduleSourceFile) as IDependencyInfo[])
              : [];

          // 02. named import case
          const namedImports =
            importClause != null
              ? (getNamedImport(importClause, sourceFile, moduleSourceFile) as IDependencyInfo[])
              : [];

          return [
            // 01. default import case
            ...defaultImports,
            // 02. named import case
            ...namedImports,
          ];
        })
        .flat();

      const exportStatements = Array.from(sourceFile.getExportedDeclarations().entries())
        .map(([key, statements]) => statements.map((statement) => ({ name: key, statement })))
        .flat()
        .map<IDependencyInfo>((statement) => {
          return {
            name: statement.name,
            moduleFilePath: filePath,
            isExternal: false,
            isNamespace: false,
            children: importDeclarations,
          };
        });

      exportStatements.forEach((statement) => {
        const key = getDependencyInfoMapKey(statement);
        const next = mergeImportInfo(dependencyInfoMap.get(key), statement);
        dependencyInfoMap.set(key, next);
      });

      return [...exportStatements, ...importDeclarations];
    })
    .flat();

  const importInfos = dedupeImportInfo(duplicatableImportInfos).map(convertImportInfoToElement);
  const importInfoMap = new Map<string, IImportInfoMapElement>(
    importInfos.map((importInfo) => [getDependencyInfoMapKey(importInfo), importInfo]),
  );

  importInfos.forEach((importInfo) => {
    const selfKey = getDependencyInfoMapKey(importInfo);
    const keys = getSourceFilePaths(importInfo).filter((key) => key !== selfKey);
    keys.forEach((key) => {
      const parent = importInfoMap.get(key);

      if (parent != null) {
        parent.sourceFilePath.set(getDependencyInfoMapKey(importInfo), true);
      }
    });
  });

  const map = new Map<string, IImportInfoMapElement>();

  importInfos.forEach((importInfo) => {
    const prev = map.get(importInfo.name);

    if (prev == null) {
      map.set(importInfo.name, importInfo);
    } else {
      const importInfoElementMap = new Map<string, IImportInfoMapElement>();

      [prev, importInfo].forEach((importInfoElement) => {
        const key = importInfoElement.name;
        const prevElement = importInfoElementMap.get(key);

        if (prevElement == null) {
          importInfoElementMap.set(key, importInfoElement);
        } else {
          const next = importInfoElement;
          Array.from(prevElement.sourceFilePath.keys()).forEach((sourceFilePath) => {
            next.sourceFilePath.set(sourceFilePath, true);
          });

          importInfoElementMap.set(key, next);
          map.set(importInfo.name, next);
        }
      });

      // map.set(importInfo.name, [...Array.from(importInfoElementMap.values())]);
    }
  });

  return map;
}
