export function eyesSkull(current: string[], generated: string[][]) {
  if (current[3] === 'Skeleton') {
    current[5] = '';
  }

  return current;
}
