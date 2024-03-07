export interface IFileImportInfoElement {
  /**
   * import name
   */
  name: string;

  /** import from */
  moduleFilePath?: string;

  /** import from */
  sourceFilePath: Map<string, boolean>;

  /**
   * is external import
   */
  isExternal: boolean;

  /**
   * is namespace
   */
  isNamespace: boolean;
}
