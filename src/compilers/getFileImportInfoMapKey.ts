import type { IFileImportInfo } from '#/compilers/interfaces/IFileImportInfo';

export function getFileImportInfoMapKey(
  importInfo: Pick<IFileImportInfo, 'moduleFilePath' | 'name'>,
): string {
  return [importInfo.moduleFilePath, importInfo.name]
    .filter((element) => element != null)
    .join('--');
}
