import path from 'path';
import getTsConfig from 'src/compilers/getTsConfig';
import getTsProject from 'src/compilers/getTsProject';

describe('getTsProject', () => {
  test('pass', () => {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    const project = getTsProject(tsconfigPath, { sourceMap: true });
    expect(project).toBeDefined();
  });
});

describe('getTsConfig', () => {
  test('pass', () => {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    const tsconfig = getTsConfig(tsconfigPath);

    expect(tsconfig).toMatchObject({
      extends: '@tsconfig/node16/tsconfig.json',
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

  test('exception', () => {
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
