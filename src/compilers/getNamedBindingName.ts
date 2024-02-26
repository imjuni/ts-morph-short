import type { INamedBindingName } from '#/compilers/interfaces/INamedBindingName';
import type { ImportClause } from 'ts-morph';
import { SyntaxKind } from 'ts-morph';

export function getNamedBindingName(
  bindings: ReturnType<ImportClause['getNamedBindings']>,
): INamedBindingName[] {
  if (bindings == null) {
    return [];
  }

  if (bindings.getKind() === SyntaxKind.NamespaceImport) {
    const namespaceImport = bindings.asKindOrThrow(SyntaxKind.NamespaceImport);

    return [
      {
        kind: 'namespace',
        name: namespaceImport.getName(),
      },
    ];
  }

  const namedImports = bindings.asKindOrThrow(SyntaxKind.NamedImports);

  const names = namedImports.getElements().map((element) => {
    return {
      kind: 'named',
      name: element.getName(),
    } satisfies INamedBindingName;
  });

  return names;
}
