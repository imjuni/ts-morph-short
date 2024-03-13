import { getDependencyInfoMapKey } from '#/compilers/getDependencyInfoMapKey';
import type { IDependencyInfo } from '#/compilers/interfaces/IDependencyInfo';
import { mergeImportInfo } from '#/compilers/mergeImportInfo';

export function dedupeImportInfo(importInfos: IDependencyInfo[]): IDependencyInfo[] {
  const map = new Map<string, IDependencyInfo>();

  importInfos.forEach((importInfo) => {
    const key = getDependencyInfoMapKey(importInfo);
    const prev = map.get(key);
    const childMap = new Map<string, IDependencyInfo>();

    if (prev != null) {
      prev.children?.forEach((child) => {
        const childKey = getDependencyInfoMapKey(child);

        if (childMap.get(childKey) == null) {
          childMap.set(childKey, child);
        }
      });

      importInfo.children?.forEach((child) => {
        const childKey = getDependencyInfoMapKey(child);
        const prevChild = childMap.get(childKey);

        if (child != null) {
          const merged = mergeImportInfo(prevChild, child);
          childMap.set(childKey, merged);
        }
      });

      // eslint-disable-next-line no-param-reassign
      importInfo.children = Array.from(childMap.values());
      map.set(key, importInfo);
    } else {
      map.set(key, importInfo);
    }
  });

  return Array.from(map.values());
}
