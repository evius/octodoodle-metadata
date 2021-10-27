export function mittens(current: string[], generated: string[][]) {
  if (current[9] === 'Mittens') {
    current[8] = '';
  }

  return current;
}
