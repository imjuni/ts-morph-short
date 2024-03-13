import { getDependencyInfoMapKey } from '#/compilers/getDependencyInfoMapKey';
import type { IDependencyInfo } from '#/compilers/interfaces/IDependencyInfo';

export function mergeImportInfo(
  source: IDependencyInfo | undefined,
  destination: IDependencyInfo | undefined,
): IDependencyInfo {
  if (source == null) {
    if (destination == null) {
      throw new Error('Cannot found dependency-info');
    }

    return destination;
  }

  if (destination == null) {
    return source;
  }

  const { children } = destination;

  if (children == null) {
    return source;
  }

  const duplicable = [...(source.children ?? []), ...children];
  const map = new Map<string, IDependencyInfo>();

  duplicable.forEach((dependencyInfo) => {
    const key = getDependencyInfoMapKey(dependencyInfo);
    const prev = map.get(key);

    if (prev == null) {
      map.set(key, dependencyInfo);
    } else {
      map.set(key, { ...prev, ...dependencyInfo });
    }
  });

  return {
    ...source,
    children: Array.from(map.values()),
  };
}
