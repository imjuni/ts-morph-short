import type { IFileImportInfo } from '#/compilers/interfaces/IFileImportInfo';
import { isExternal } from '#/compilers/isExternal';
import type * as tsm from 'ts-morph';

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
