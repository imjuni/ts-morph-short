import getNamedBindingName from 'src/compilers/getNamedBindingName';
import type IFileImportInfo from 'src/compilers/interfaces/IFileImportInfo';
import type * as tsm from 'ts-morph';

export function isExternal(sourceFile?: tsm.SourceFile) {
  if (sourceFile == null) {
    return true;
  }

  return sourceFile.isFromExternalLibrary() || sourceFile.isInNodeModules();
}

export function getDefaultImport(
  identifier: tsm.Identifier,
  sourceFile: tsm.SourceFile,
  moduleSourceFile?: tsm.SourceFile,
): IFileImportInfo[] {
  const name = identifier.getText();

  return [
    {
      name,
      sourceFilePath: sourceFile.getFilePath().toString(),
      moduleFilePath: moduleSourceFile?.getFilePath().toString(),
      isExternal: isExternal(moduleSourceFile),
      isNamespace: false,
    },
  ] satisfies IFileImportInfo[];
}

export function getNamedImport(
  importClause: tsm.ImportClause,
  sourceFile: tsm.SourceFile,
  moduleSourceFile?: tsm.SourceFile,
): IFileImportInfo[] {
  const namedBindings = importClause?.getNamedBindings();

  if (namedBindings == null) {
    return [];
  }

  const names = getNamedBindingName(namedBindings);

  if (moduleSourceFile == null) {
    return names.map((name) => {
      return {
        name: name.name,
        sourceFilePath: sourceFile.getFilePath().toString(),
        moduleFilePath: undefined,
        isExternal: true,
        isNamespace: name.kind === 'namespace',
      } satisfies IFileImportInfo;
    });
  }

  return names.map((name) => {
    return {
      name: name.name,
      sourceFilePath: sourceFile.getFilePath().toString(),
      moduleFilePath: moduleSourceFile.getFilePath().toString(),
      isExternal: isExternal(moduleSourceFile),
      isNamespace: name.kind === 'namespace',
    } satisfies IFileImportInfo;
  });
}

export default function getFileImportInfos(
  project: tsm.Project,
  sourceFilePath: string,
): IFileImportInfo[] {
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
