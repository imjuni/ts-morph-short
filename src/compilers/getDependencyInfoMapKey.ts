import type { IDependencyInfo } from '#/compilers/interfaces/IDependencyInfo';
import { createHash } from 'node:crypto';

export function getDependencyInfoMapKey(
  deps: Pick<IDependencyInfo, 'name' | 'moduleFilePath'>,
): string {
  if (deps.moduleFilePath == null) {
    return `${deps.name}-${createHash('sha256').update(Buffer.from(deps.name)).digest('base64')}`;
  }

  return `${deps.name}-${createHash('sha256').update(Buffer.from(deps.moduleFilePath)).digest('base64')}`;
}
