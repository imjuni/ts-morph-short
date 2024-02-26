import { isExternal } from '#/compilers/getFileImportInfos';
import { getNamedBindingName } from '#/compilers/getNamedBindingName';
import { getTsProject } from '#/compilers/getTsProject';
import path from 'node:path';
import type * as tsm from 'ts-morph';
import { beforeAll, describe, expect, it } from 'vitest';

const context: { project: tsm.Project } = {} as any;

beforeAll(async () => {
  context.project = await getTsProject(path.join(process.cwd(), 'tsconfig.json'));
});

describe('isExternal', () => {
  it('pass - undefined', () => {
    const r = isExternal(undefined);
    expect(r).toBeTruthy();
  });

  it('pass - sourceFile', () => {
    const sourceFile = context.project.getSourceFileOrThrow('src/compilers/getFileImportInfos.ts');
    const r = isExternal(sourceFile);
    expect(r).toBeFalsy();
  });
});

describe('getNamedBindingName', () => {
  it('pass - undefined', () => {
    const r = getNamedBindingName(undefined);
    expect(r).toMatchObject([]);
  });
});
