import { getImportInfoMap } from '#/compilers/getImportInfoMap';
import { getTypeScriptProject } from '#/compilers/getTypeScriptProject';
import type { IImportInfoMapElement } from '#/compilers/interfaces/IImportInfoMapElement';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('getImportInfoMap', () => {
  it('single imports', () => {
    const project = getTypeScriptProject(path.join(process.cwd(), 'tsconfig.test.json'));
    const filePath = 'src/compilers/getCase02.ts';
    const content = `import * as tsm from 'ts-morph';
import { default as IFileImportInfo } from './interfaces/IFileImportInfo';
import type INamedBindingName from 'src/compilers/interfaces/INamedBindingName';`;

    project.createSourceFile(filePath, content, { overwrite: true });

    const infos = getImportInfoMap(project);
    const r01 = Array.from(infos.entries()).reduce<Record<string, IImportInfoMapElement>>(
      (aggregation, [key, value]) => {
        return { ...aggregation, [key]: value };
      },
      {},
    );

    expect(r01).toMatchObject({
      INamedBindingName: {
        name: 'INamedBindingName',
        sourceFilePath: {},
        moduleFilePath: path.join(process.cwd(), '/src/compilers/interfaces/INamedBindingName.ts'),
        isExternal: false,
        isNamespace: false,
      },
    });
  });

  it('multiple depths imports', () => {
    const project = getTypeScriptProject(path.join(process.cwd(), 'tsconfig.test.json'));
    const source01 = {
      filePath: 'a.ts',
      content: `export class A {}`,
    };

    const source02 = {
      filePath: 'b.ts',
      content: `import { A } from './a'; export class B { private vara: A }`,
    };

    const source03 = {
      filePath: 'c.ts',
      content: `
import { A } from './a';
import { B } from './b';

export class C { private vara: B }
export class D { private vara: A }`,
    };

    const source04 = {
      filePath: 'e.ts',
      content: `import { C } from './c'; export class E { private vara: C }`,
    };

    project.createSourceFile(source01.filePath, source01.content, { overwrite: true });
    project.createSourceFile(source02.filePath, source02.content, { overwrite: true });
    project.createSourceFile(source03.filePath, source03.content, { overwrite: true });
    project.createSourceFile(source04.filePath, source04.content, { overwrite: true });

    const infos = getImportInfoMap(project);
    const r01 = Array.from(infos.entries()).reduce<Record<string, IImportInfoMapElement>>(
      (aggregation, [key, value]) => {
        return { ...aggregation, [key]: value };
      },
      {},
    );

    console.log(r01);
    const ep = {
      A: {
        name: 'A',
        sourceFilePath: {},
        moduleFilePath: path.join(process.cwd(), 'a.ts'),
        isExternal: false,
        isNamespace: false,
        children: [],
      },
      B: {
        name: 'B',
        sourceFilePath: {},
        moduleFilePath: path.join(process.cwd(), 'b.ts'),
        isExternal: false,
        isNamespace: false,
        children: [
          {
            name: 'A',
            sourceFilePath: path.join(process.cwd(), 'b.ts'),
            moduleFilePath: path.join(process.cwd(), 'a.ts'),
            isExternal: false,
            isNamespace: false,
            children: [],
          },
        ],
      },
      C: {
        name: 'C',
        sourceFilePath: {},
        moduleFilePath: path.join(process.cwd(), 'c.ts'),
        isExternal: false,
        isNamespace: false,
        children: [
          {
            name: 'A',
            sourceFilePath: path.join(process.cwd(), 'c.ts'),
            moduleFilePath: path.join(process.cwd(), 'a.ts'),
            isExternal: false,
            isNamespace: false,
            children: [],
          },
          {
            name: 'B',
            sourceFilePath: path.join(process.cwd(), 'c.ts'),
            moduleFilePath: path.join(process.cwd(), 'b.ts'),
            isExternal: false,
            isNamespace: false,
            children: [
              {
                name: 'A',
                sourceFilePath: path.join(process.cwd(), 'b.ts'),
                moduleFilePath: path.join(process.cwd(), 'a.ts'),
                isExternal: false,
                isNamespace: false,
                children: [],
              },
            ],
          },
        ],
      },
      D: {
        name: 'D',
        moduleFilePath: path.join(process.cwd(), 'c.ts'),
        isExternal: false,
        isNamespace: false,
        children: [
          {
            name: 'A',
            sourceFilePath: path.join(process.cwd(), 'c.ts'),
            moduleFilePath: path.join(process.cwd(), 'a.ts'),
            isExternal: false,
            isNamespace: false,
            children: [],
          },
          {
            name: 'B',
            sourceFilePath: path.join(process.cwd(), 'c.ts'),
            moduleFilePath: path.join(process.cwd(), 'b.ts'),
            isExternal: false,
            isNamespace: false,
            children: [
              {
                name: 'A',
                sourceFilePath: path.join(process.cwd(), 'b.ts'),
                moduleFilePath: path.join(process.cwd(), 'a.ts'),
                isExternal: false,
                isNamespace: false,
                children: [],
              },
            ],
          },
        ],
        sourceFilePath: {},
      },
      E: {
        name: 'E',
        moduleFilePath: path.join(process.cwd(), 'e.ts'),
        isExternal: false,
        isNamespace: false,
        children: [
          {
            name: 'C',
            sourceFilePath: path.join(process.cwd(), 'e.ts'),
            moduleFilePath: path.join(process.cwd(), 'c.ts'),
            isExternal: false,
            isNamespace: false,
            children: [
              {
                name: 'A',
                sourceFilePath: path.join(process.cwd(), 'c.ts'),
                moduleFilePath: path.join(process.cwd(), 'a.ts'),
                isExternal: false,
                isNamespace: false,
                children: [],
              },
              {
                name: 'B',
                sourceFilePath: path.join(process.cwd(), 'c.ts'),
                moduleFilePath: path.join(process.cwd(), 'b.ts'),
                isExternal: false,
                isNamespace: false,
                children: [
                  {
                    name: 'A',
                    sourceFilePath: path.join(process.cwd(), 'b.ts'),
                    moduleFilePath: path.join(process.cwd(), 'a.ts'),
                    isExternal: false,
                    isNamespace: false,
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
        sourceFilePath: {},
      },
    };

    expect(r01).toMatchObject(ep);
  });
});
