import { getNamedBindingName } from '#/compilers/getNamedBindingName';
import { getTypeScriptProject } from '#/compilers/getTypeScriptProject';
import { isExternal } from '#/compilers/isExternal';
import path from 'node:path';
import type * as tsm from 'ts-morph';
import { describe, expect, it } from 'vitest';

const context: { project: tsm.Project } = {
  project: getTypeScriptProject(path.join(process.cwd(), 'tsconfig.json')),
};

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
