import { getFileImportInfoMap } from '#/compilers/getFileImportInfoMap';
import { getTypeScriptProject } from '#/compilers/getTypeScriptProject';
import type { IFileImportInfoElement } from '#/compilers/interfaces/IFileImportInfoElement';
import path from 'node:path';
import type * as tsm from 'ts-morph';
import { describe, expect, it } from 'vitest';

const context: { project: tsm.Project } = {
  project: getTypeScriptProject(path.join(process.cwd(), 'tsconfig.json')),
};

describe('getFileImportInfoMap', () => {
  it('pass', () => {
    const filePath = 'src/compilers/getCase02.ts';
    const content = `import * as tsm from 'ts-morph';
import { default as IFileImportInfo } from './interfaces/IFileImportInfo';
import type INamedBindingName from 'src/compilers/interfaces/INamedBindingName';`;

    context.project.createSourceFile(filePath, content, { overwrite: true });

    const infos = getFileImportInfoMap(context.project);
    const r01 = Array.from(infos.entries()).reduce<Record<string, IFileImportInfoElement[]>>(
      (aggregation, [key, value]) => {
        return { ...aggregation, [key]: value };
      },
      {},
    );

    expect(r01).toMatchObject({
      INamedBindingName: [
        {
          name: 'INamedBindingName',
          moduleFilePath: path.join(process.cwd(), 'src/compilers/interfaces/INamedBindingName.ts'),
          isExternal: false,
          isNamespace: false,
        },
      ],
      IFileImportInfo: [
        {
          name: 'IFileImportInfo',
          moduleFilePath: path.join(process.cwd(), '/src/compilers/interfaces/IFileImportInfo.ts'),
          isExternal: false,
          isNamespace: false,
        },
      ],
      isExternal: [
        {
          name: 'isExternal',
          moduleFilePath: path.join(process.cwd(), 'src/compilers/isExternal.ts'),
          isExternal: false,
          isNamespace: false,
        },
      ],
      getDefaultImport: [
        {
          name: 'getDefaultImport',
          moduleFilePath: path.join(process.cwd(), 'src/compilers/getDefaultImport.ts'),
          isExternal: false,
          isNamespace: false,
        },
      ],
      getFileImportInfoMapKey: [
        {
          name: 'getFileImportInfoMapKey',
          moduleFilePath: path.join(process.cwd(), 'src/compilers/getFileImportInfoMapKey.ts'),
          isExternal: false,
          isNamespace: false,
        },
      ],
      getNamedImport: [
        {
          name: 'getNamedImport',
          moduleFilePath: path.join(process.cwd(), 'src/compilers/getNamedImport.ts'),
          isExternal: false,
          isNamespace: false,
        },
      ],
      IFileImportInfoElement: [
        {
          name: 'IFileImportInfoElement',
          moduleFilePath: path.join(
            process.cwd(),
            'src/compilers/interfaces/IFileImportInfoElement.ts',
          ),
          isExternal: false,
          isNamespace: false,
        },
      ],
      getNamedBindingName: [
        {
          name: 'getNamedBindingName',
          moduleFilePath: path.join(process.cwd(), 'src/compilers/getNamedBindingName.ts'),
          isExternal: false,
          isNamespace: false,
        },
      ],
      getFileImportInfos: [
        {
          name: 'getFileImportInfos',
          moduleFilePath: path.join(process.cwd(), 'src/compilers/getFileImportInfos.ts'),
          isExternal: false,
          isNamespace: false,
        },
      ],
      getTypeScriptProject: [
        {
          name: 'getTypeScriptProject',
          moduleFilePath: path.join(process.cwd(), 'src/compilers/getTypeScriptProject.ts'),
          isExternal: false,
          isNamespace: false,
        },
      ],
      getFileImportInfoMap: [
        {
          name: 'getFileImportInfoMap',
          moduleFilePath: path.join(process.cwd(), 'src/compilers/getFileImportInfoMap.ts'),
          isExternal: false,
          isNamespace: false,
        },
      ],
      getTypeScriptConfig: [
        {
          name: 'getTypeScriptConfig',
          moduleFilePath: path.join(process.cwd(), 'src/compilers/getTypeScriptConfig.ts'),
          isExternal: false,
          isNamespace: false,
        },
      ],
    });
  });
});
