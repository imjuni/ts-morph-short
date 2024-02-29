import { getTypeScriptConfig } from '#/compilers/getTypeScriptConfig';
import { getTypeScriptProject } from '#/compilers/getTypeScriptProject';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('getTypeScriptProject', () => {
  it('pass', () => {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    const project = getTypeScriptProject(tsconfigPath, { sourceMap: true });
    expect(project).toBeDefined();
  });
});

describe('getTypeScriptConfig', () => {
  it('pass', () => {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    const tsconfig = getTypeScriptConfig(tsconfigPath);

    expect(tsconfig).toMatchObject({
      options: {
        lib: ['lib.dom.d.ts', 'lib.dom.iterable.d.ts', 'lib.es2020.d.ts'],
        module: 100,
        target: 9,
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        moduleResolution: 3,
        declaration: true,
        declarationMap: true,
        sourceMap: true,
        removeComments: true,
        importHelpers: true,
        newLine: 1,
        noImplicitAny: false,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        isolatedModules: true,
        noUncheckedIndexedAccess: true,
        paths: {
          '#/*': ['src/*'],
        },
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        pretty: true,
      },
      raw: {
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
          rootDir: '.',
          paths: {
            '#/*': ['src/*'],
          },
          esModuleInterop: true,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          pretty: true,
        },
        include: ['src/**/*.ts'],
        exclude: ['dist/**', '.configs/**'],
        compileOnSave: false,
      },
      errors: [],
      compileOnSave: false,
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
      getTypeScriptConfig(tsconfigPath);
    }).toThrow();
  });
});
