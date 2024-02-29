import path from 'node:path';
import * as tsm from 'ts-morph';
import type { TsConfigJson } from 'type-fest';

export function getTypeScriptConfig(
  tsconfigPath: string,
): Omit<tsm.ts.ParsedCommandLine, 'raw'> & { raw: TsConfigJson } {
  const parseConfigHost: tsm.ts.ParseConfigHost = {
    fileExists: tsm.ts.sys.fileExists.bind(tsm.ts),
    readFile: tsm.ts.sys.readFile.bind(tsm.ts),
    readDirectory: tsm.ts.sys.readDirectory.bind(tsm.ts),
    useCaseSensitiveFileNames: true,
  };
  const configFile = tsm.ts.readConfigFile(tsconfigPath, tsm.ts.sys.readFile.bind(tsm.ts.sys));

  if (configFile.error != null && configFile.error?.category === tsm.ts.DiagnosticCategory.Error) {
    throw new Error(`invalid: ${tsconfigPath}`);
  }

  const tsconfig = tsm.ts.parseJsonConfigFileContent(
    configFile.config,
    parseConfigHost,
    path.dirname(tsconfigPath),
  ) as Omit<tsm.ts.ParsedCommandLine, 'raw'> & { raw: TsConfigJson };

  return tsconfig;
}
