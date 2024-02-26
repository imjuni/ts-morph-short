import * as tsm from 'ts-morph';

export function getTsConfig(tsconfigPath: string): Record<string, unknown> {
  const { config, error } = tsm.ts.readConfigFile(
    tsconfigPath,
    tsm.ts.sys.readFile.bind(tsm.ts.sys),
  );

  if (error != null && error?.category === tsm.ts.DiagnosticCategory.Error) {
    throw new Error(`invalid: ${tsconfigPath}`);
  }

  return config;
}
