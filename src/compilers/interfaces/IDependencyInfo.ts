import type { IImportInfo } from '#/compilers/interfaces/IImportInfo';

export interface IDependencyInfo extends Omit<IImportInfo, 'sourceFilePath'> {
  /** children dependency */
  children?: IDependencyInfo[];
}
