import { getTsConfig } from '#/compilers/getTsConfig';
import { getTsProject } from '#/compilers/getTsProject';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('getTsProject', () => {
  it('pass', () => {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    const project = getTsProject(tsconfigPath, { sourceMap: true });
    expect(project).toBeDefined();
  });
});

describe('getTsConfig', () => {
  it('pass', () => {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    const tsconfig = getTsConfig(tsconfigPath);

    expect(tsconfig).toMatchObject({
      extends: '@tsconfig/node18/tsconfig.json',
      'ts-node': {
        transpileOnly: true,
        files: true,
        esm: true,
        compilerOptions: {},
        require: ['tsconfig-paths/register'],
      },
      compilerOptions: {
        declaration: true,
        lib: ['DOM', 'DOM.Iterable', 'ES2020'],
        declarationMap: true,
        sourceMap: true,
        outDir: './dist',
        removeComments: true,
        importHelpers: true,
        newLine: 'lf',
        strict: true,
        noImplicitAny: false,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        isolatedModules: true,
        noUncheckedIndexedAccess: true,
        baseUrl: '.',
        esModuleInterop: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        pretty: true,
      },
      include: ['src/**/*.ts'],
      exclude: ['dist/**', '.configs/**'],
    });
  });

  it('exception', () => {
    const tsconfigPath = path.join(
      process.cwd(),
      'src',
      'compilers',
      '__tests__',
      'test-sources',
      'tsconfig.json',
    );

    expect(() => {
      getTsConfig(tsconfigPath);
    }).toThrow();
  });
});
