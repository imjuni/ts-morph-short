import { getNamedBindingName } from '#/compilers/getNamedBindingName';
import type { IFileImportInfo } from '#/compilers/interfaces/IFileImportInfo';
import { isExternal } from '#/compilers/isExternal';
import type * as tsm from 'ts-morph';

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
