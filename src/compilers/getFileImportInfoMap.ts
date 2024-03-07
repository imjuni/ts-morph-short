import { getDefaultImport } from '#/compilers/getDefaultImport';
import { getFileImportInfoMapKey } from '#/compilers/getFileImportInfoMapKey';
import { getNamedImport } from '#/compilers/getNamedImport';
import type { IFileImportInfo } from '#/compilers/interfaces/IFileImportInfo';
import type { IFileImportInfoElement } from '#/compilers/interfaces/IFileImportInfoElement';
import type * as tsm from 'ts-morph';

function convertImportInfoToElement(
  importInfo: IFileImportInfo | IFileImportInfoElement,
): IFileImportInfoElement {
  const { sourceFilePath } = importInfo;

  if (sourceFilePath == null) {
    const next: IFileImportInfoElement = {
      ...importInfo,
      sourceFilePath: new Map<string, boolean>(),
    };
    return next;
  }

  if (typeof sourceFilePath === 'string') {
    const next: IFileImportInfoElement = {
      ...importInfo,
      sourceFilePath: new Map<string, boolean>([[sourceFilePath, true]]),
    };

    return next;
  }

  const next: IFileImportInfoElement = {
    ...importInfo,
    sourceFilePath,
  };
  return next;
}

export function getFileImportInfoMap(project: tsm.Project): Map<string, IFileImportInfoElement[]> {
  const filePaths = project
    .getSourceFiles()
    .map((sourceFile) => sourceFile.getFilePath().toString());

  const importInfos = filePaths
    .map((filePath) => {
      const sourceFile = project.getSourceFileOrThrow(filePath);
      const importDeclarations = sourceFile.getImportDeclarations();

      return importDeclarations
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
            importClause != null ? getNamedImport(importClause, sourceFile, moduleSourceFile) : [];

          return [
            // 01. default import case
            ...defaultImports,
            // 02. named import case
            ...namedImports,
          ];
        })
        .flat();
    })
    .flat();

  const map = new Map<string, IFileImportInfoElement[]>();

  importInfos.forEach((importInfo) => {
    const prev = map.get(importInfo.name);

    if (prev == null) {
      map.set(importInfo.name, [convertImportInfoToElement(importInfo)]);
    } else {
      const importInfoElementMap = new Map<string, IFileImportInfoElement>();

      [...prev, importInfo].forEach((importInfoElement) => {
        const key = getFileImportInfoMapKey(importInfoElement);
        const prevElement = importInfoElementMap.get(key);

        if (prevElement == null) {
          importInfoElementMap.set(key, convertImportInfoToElement(importInfoElement));
        } else {
          const next = convertImportInfoToElement(importInfoElement);
          Array.from(prevElement.sourceFilePath.keys()).forEach((sourceFilePath) => {
            next.sourceFilePath.set(sourceFilePath, true);
          });

          importInfoElementMap.set(key, next);
          map.set(importInfo.name, [next]);
        }
      });

      map.set(importInfo.name, [...Array.from(importInfoElementMap.values())]);
    }
  });

  return map;
}
