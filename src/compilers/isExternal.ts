import type * as tsm from 'ts-morph';

export function isExternal(sourceFile?: tsm.SourceFile) {
  if (sourceFile == null) {
    return true;
  }

  return sourceFile.isFromExternalLibrary() || sourceFile.isInNodeModules();
}
