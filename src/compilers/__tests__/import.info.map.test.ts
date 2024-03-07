import { getFileImportInfoMap } from '#/compilers/getFileImportInfoMap';
import { getTypeScriptProject } from '#/compilers/getTypeScriptProject';
import type { IFileImportInfo } from '#/compilers/interfaces/IFileImportInfo';
import path from 'node:path';
import type * as tsm from 'ts-morph';
import { describe, expect, it } from 'vitest';

const context: { project: tsm.Project } = {
  project: getTypeScriptProject(path.join(process.cwd(), 'tsconfig.json')),
};

describe('getFileImportInfoMap', () => {
  it('pass - 2', () => {
    const filePath = 'src/compilers/getCase02.ts';
    const content = `import * as tsm from 'ts-morph';
import { default as IFileImportInfo } from './interfaces/IFileImportInfo';
import type INamedBindingName from 'src/compilers/interfaces/INamedBindingName';`;

    context.project.createSourceFile(filePath, content, { overwrite: true });

    const infos = getFileImportInfoMap(context.project);
    const r01 = Array.from(infos.entries()).reduce<Record<string, IFileImportInfo>>(
      (aggregation, [key, value]) => {
        return { ...aggregation, [key]: value };
      },
      {},
    );

    expect(r01).toMatchObject({
      [path.join(process.cwd(), 'src/compilers/interfaces/IFileImportInfo.ts--default')]: {
        name: 'default',
        sourceFilePath: path.join(process.cwd(), 'src/compilers/getCase02.ts'),
        moduleFilePath: path.join(process.cwd(), 'src/compilers/interfaces/IFileImportInfo.ts'),
        isExternal: false,
        isNamespace: false,
      },
      [path.join(
        process.cwd(),
        'src/compilers/interfaces/INamedBindingName.ts--INamedBindingName',
      )]: {
        name: 'INamedBindingName',
        sourceFilePath: path.join(process.cwd(), 'src/compilers/getNamedBindingName.ts'),
        moduleFilePath: path.join(process.cwd(), 'src/compilers/interfaces/INamedBindingName.ts'),
        isExternal: false,
        isNamespace: false,
      },
      [path.join(process.cwd(), 'src/compilers/interfaces/IFileImportInfo.ts--IFileImportInfo')]: {
        name: 'IFileImportInfo',
        sourceFilePath: path.join(process.cwd(), 'src/compilers/__tests__/import.info.map.test.ts'),
        moduleFilePath: path.join(process.cwd(), 'src/compilers/interfaces/IFileImportInfo.ts'),
        isExternal: false,
        isNamespace: false,
      },
      [path.join(process.cwd(), 'src/compilers/isExternal.ts--isExternal')]: {
        name: 'isExternal',
        sourceFilePath: path.join(process.cwd(), 'src/compilers/__tests__/compiler.tool.test.ts'),
        moduleFilePath: path.join(process.cwd(), 'src/compilers/isExternal.ts'),
        isExternal: false,
        isNamespace: false,
      },
      [path.join(process.cwd(), 'src/compilers/getDefaultImport.ts--getDefaultImport')]: {
        name: 'getDefaultImport',
        sourceFilePath: path.join(process.cwd(), 'src/compilers/getFileImportInfos.ts'),
        moduleFilePath: path.join(process.cwd(), 'src/compilers/getDefaultImport.ts'),
        isExternal: false,
        isNamespace: false,
      },
      [path.join(
        process.cwd(),
        'src/compilers/getFileImportInfoMapKey.ts--getFileImportInfoMapKey',
      )]: {
        name: 'getFileImportInfoMapKey',
        sourceFilePath: path.join(process.cwd(), 'src/compilers/__tests__/compiler.tool.test.ts'),
        moduleFilePath: path.join(process.cwd(), 'src/compilers/getFileImportInfoMapKey.ts'),
        isExternal: false,
        isNamespace: false,
      },
      [path.join(process.cwd(), 'src/compilers/getNamedImport.ts--getNamedImport')]: {
        name: 'getNamedImport',
        sourceFilePath: path.join(process.cwd(), 'src/compilers/getFileImportInfos.ts'),
        moduleFilePath: path.join(process.cwd(), 'src/compilers/getNamedImport.ts'),
        isExternal: false,
        isNamespace: false,
      },
      [path.join(process.cwd(), 'src/compilers/getNamedBindingName.ts--getNamedBindingName')]: {
        name: 'getNamedBindingName',
        sourceFilePath: path.join(process.cwd(), 'src/compilers/__tests__/compiler.tool.test.ts'),
        moduleFilePath: path.join(process.cwd(), 'src/compilers/getNamedBindingName.ts'),
        isExternal: false,
        isNamespace: false,
      },
      path: {
        name: 'path',
        sourceFilePath: path.join(process.cwd(), 'src/compilers/__tests__/project.test.ts'),
        moduleFilePath: undefined,
        isExternal: true,
        isNamespace: false,
      },
      [path.join(process.cwd(), 'src/compilers/getFileImportInfos.ts--getFileImportInfos')]: {
        name: 'getFileImportInfos',
        sourceFilePath: path.join(process.cwd(), 'src/compilers/__tests__/compiler.test.ts'),
        moduleFilePath: path.join(process.cwd(), 'src/compilers/getFileImportInfos.ts'),
        isExternal: false,
        isNamespace: false,
      },
      [path.join(process.cwd(), 'src/compilers/getTypeScriptProject.ts--getTypeScriptProject')]: {
        name: 'getTypeScriptProject',
        sourceFilePath: path.join(process.cwd(), 'src/compilers/__tests__/project.test.ts'),
        moduleFilePath: path.join(process.cwd(), 'src/compilers/getTypeScriptProject.ts'),
        isExternal: false,
        isNamespace: false,
      },
      [path.join(process.cwd(), 'src/compilers/getFileImportInfoMap.ts--getFileImportInfoMap')]: {
        name: 'getFileImportInfoMap',
        sourceFilePath: path.join(process.cwd(), 'src/compilers/__tests__/import.info.map.test.ts'),
        moduleFilePath: path.join(process.cwd(), 'src/compilers/getFileImportInfoMap.ts'),
        isExternal: false,
        isNamespace: false,
      },
      [path.join(process.cwd(), 'src/compilers/getTypeScriptConfig.ts--getTypeScriptConfig')]: {
        name: 'getTypeScriptConfig',
        sourceFilePath: path.join(process.cwd(), 'src/compilers/__tests__/project.test.ts'),
        moduleFilePath: path.join(process.cwd(), 'src/compilers/getTypeScriptConfig.ts'),
        isExternal: false,
        isNamespace: false,
      },
    });
  });
});
