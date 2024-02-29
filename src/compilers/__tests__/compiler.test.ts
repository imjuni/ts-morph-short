import { getFileImportInfos } from '#/compilers/getFileImportInfos';
import { getTypeScriptProject } from '#/compilers/getTypeScriptProject';
import path from 'node:path';

import type * as tsm from 'ts-morph';
import { beforeAll, describe, expect, it } from 'vitest';

const context: { project: tsm.Project } = {} as any;

beforeAll(async () => {
  context.project = await getTypeScriptProject(path.join(process.cwd(), 'tsconfig.json'));
});

describe('getTsProject', () => {
  it('pass - 1', () => {
    const filePath = 'src/compilers/getCase01.ts';
    const content = `import * as tsm from 'ts-morph';\nimport IFileImportInfo from './interfaces/IFileImportInfo';`;

    context.project.createSourceFile(filePath, content, { overwrite: true });

    const infos = getFileImportInfos(context.project, filePath);

    expect(infos).toMatchObject([
      {
        name: 'tsm',
        sourceFilePath: path.join(process.cwd(), '/src/compilers/getCase01.ts'),
        // moduleFilePath: path.join(process.cwd(), '/node_modules/ts-morph/lib/ts-morph.d.ts'),
        isExternal: true,
        isNamespace: true,
      },
      {
        name: 'IFileImportInfo',
        sourceFilePath: path.join(process.cwd(), '/src/compilers/getCase01.ts'),
        moduleFilePath: path.join(process.cwd(), '/src/compilers/interfaces/IFileImportInfo.ts'),
        isExternal: false,
        isNamespace: false,
      },
    ]);
  });

  it('pass - 2', () => {
    const filePath = 'src/compilers/getCase02.ts';
    const content = `import * as tsm from 'ts-morph';
import { default as IFileImportInfo } from './interfaces/IFileImportInfo';
import type INamedBindingName from 'src/compilers/interfaces/INamedBindingName';`;

    context.project.createSourceFile(filePath, content, { overwrite: true });

    const infos = getFileImportInfos(context.project, filePath);

    expect(infos).toMatchObject([
      {
        name: 'tsm',
        sourceFilePath: path.join(process.cwd(), '/src/compilers/getCase02.ts'),
        // moduleFilePath: path.join(process.cwd(), '/node_modules/ts-morph/lib/ts-morph.d.ts'),
        isExternal: true,
        isNamespace: true,
      },
      {
        name: 'default',
        sourceFilePath: path.join(process.cwd(), '/src/compilers/getCase02.ts'),
        // moduleFilePath: path.join(process.cwd(), '/src/compilers/interfaces/IFileImportInfo.ts'),
        isExternal: false,
        isNamespace: false,
      },
      {
        name: 'INamedBindingName',
        sourceFilePath: path.join(process.cwd(), '/src/compilers/getCase02.ts'),
        // moduleFilePath: path.join(process.cwd(), '/src/compilers/interfaces/INamedBindingName.ts'),
        isExternal: false,
        isNamespace: false,
      },
    ]);
  });

  it('pass - 3', () => {
    const filePath = 'src/compilers/getCase02.ts';
    const content = `import 'jest';`;

    context.project.createSourceFile(filePath, content, { overwrite: true });

    const infos = getFileImportInfos(context.project, filePath);

    expect(infos).toMatchObject([]);
  });

  it('pass - 4', () => {
    const filePath = 'src/compilers/getCase03.ts';
    const content = `import type { ImportClause, SyntaxKind } from 'ts-morph';`;

    context.project.createSourceFile(filePath, content, { overwrite: true });

    const infos = getFileImportInfos(context.project, filePath);

    expect(infos).toMatchObject([
      {
        name: 'ImportClause',
        sourceFilePath: path.join(process.cwd(), '/src/compilers/getCase03.ts'),
        // moduleFilePath: path.join(process.cwd(), '/node_modules/ts-morph/lib/ts-morph.d.ts'),
        isExternal: true,
        isNamespace: false,
      },
      {
        name: 'SyntaxKind',
        sourceFilePath: path.join(process.cwd(), '/src/compilers/getCase03.ts'),
        // moduleFilePath: path.join(process.cwd(), '/node_modules/ts-morph/lib/ts-morph.d.ts'),
        isExternal: true,
        isNamespace: false,
      },
    ]);
  });
});
