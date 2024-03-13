export interface IImportInfo {
  /**
   * import name
   */
  name: string;

  /**
   * import를 한 모듈의 경로. A 모듈을 B 파일에서 import 했다면 moduleFilePath는 A 모듈의
   * 경로가 저장된다.
   *
   * node_modules에서 불러온 파일인 경우 node_modules 경로를 저장(간혹 실패할 수 있음)
   * fs, path와 같은 node.js 기본 모듈인 경우 undefined가 저장됨. 동일 프로젝트에서 모듈을
   * 가져온 경우 프로젝트 내 그 파일의 경로가 저장됨.
   * */
  moduleFilePath?: string;

  /**
   * import를 한 파일. A 모듈을 B 파일에서 import 했다면 sourceFilePath는 B 파일의 경로가
   * 저장된다.
   * */
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
