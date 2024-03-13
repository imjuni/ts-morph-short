import type { IImportInfo } from '#/compilers/interfaces/IImportInfo';
import { isExternal } from '#/compilers/isExternal';
import type * as tsm from 'ts-morph';

export function getDefaultImport(
  identifier: tsm.Identifier,
  sourceFile: tsm.SourceFile,
  moduleSourceFile?: tsm.SourceFile,
): IImportInfo[] {
  const name = identifier.getText();

  return [
    {
      name,
      sourceFilePath: sourceFile.getFilePath().toString(),
      moduleFilePath: moduleSourceFile?.getFilePath().toString(),
      isExternal: isExternal(moduleSourceFile),
      isNamespace: false,
    },
  ] satisfies IImportInfo[];
}
