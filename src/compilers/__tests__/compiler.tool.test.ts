import path from 'path';
import { isExternal } from 'src/compilers/getFileImportInfos';
import getNamedBindingName from 'src/compilers/getNamedBindingName';
import getTsProject from 'src/compilers/getTsProject';
import type * as tsm from 'ts-morph';

const context: { project: tsm.Project } = {} as any;

beforeAll(async () => {
  context.project = await getTsProject(path.join(process.cwd(), 'tsconfig.json'));
});

describe('isExternal', () => {
  test('pass - undefined', () => {
    const r = isExternal(undefined);
    expect(r).toBeTruthy();
  });

  test('pass - sourceFile', () => {
    const sourceFile = context.project.getSourceFileOrThrow('src/compilers/getFileImportInfos.ts');
    const r = isExternal(sourceFile);
    expect(r).toBeFalsy();
  });
});

describe('getNamedBindingName', () => {
  test('pass - undefined', () => {
    const r = getNamedBindingName(undefined);
    expect(r).toMatchObject([]);
  });
});
