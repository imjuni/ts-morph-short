export interface IFileImportInfo {
  /**
   * import name
   */
  name: string;

  /** import from */
  moduleFilePath?: string;

  /** import from */
  sourceFilePath?: string;

  /**
   * is external import
   */
  isExternal: boolean;

  /**
   * is namespace
   */
  isNamespace: boolean;
}
