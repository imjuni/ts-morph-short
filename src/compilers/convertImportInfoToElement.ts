import type { IImportInfo } from '#/compilers/interfaces/IImportInfo';
import type { IImportInfoMapElement } from '#/compilers/interfaces/IImportInfoMapElement';

export function convertImportInfoToElement(
  importInfo: IImportInfo | IImportInfoMapElement,
): IImportInfoMapElement {
  const { sourceFilePath } = importInfo;

  if (sourceFilePath == null) {
    const next: IImportInfoMapElement = {
      ...importInfo,
      sourceFilePath: new Map<string, boolean>(),
    };
    return next;
  }

  if (typeof sourceFilePath === 'string') {
    const next: IImportInfoMapElement = {
      ...importInfo,
      sourceFilePath: new Map<string, boolean>(),
    };

    return next;
  }

  const next: IImportInfoMapElement = {
    ...importInfo,
    sourceFilePath,
  };
  return next;
}
