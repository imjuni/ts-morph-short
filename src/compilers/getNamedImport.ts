import { getNamedBindingName } from '#/compilers/getNamedBindingName';
import type { IImportInfo } from '#/compilers/interfaces/IImportInfo';
import { isExternal } from '#/compilers/isExternal';
import type * as tsm from 'ts-morph';

export function getNamedImport(
  importClause: tsm.ImportClause,
  sourceFile: tsm.SourceFile,
  moduleSourceFile?: tsm.SourceFile,
): IImportInfo[] {
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
      } satisfies IImportInfo;
    });
  }

  return names.map((name) => {
    return {
      name: name.name,
      sourceFilePath: sourceFile.getFilePath().toString(),
      moduleFilePath: moduleSourceFile.getFilePath().toString(),
      isExternal: isExternal(moduleSourceFile),
      isNamespace: name.kind === 'namespace',
    } satisfies IImportInfo;
  });
}
