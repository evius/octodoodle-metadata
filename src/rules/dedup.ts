export function dedup(current: string[], generated: string[][]) {
  const currentKey = current.join('');

  const existing = generated.find((x) => x.join('') === currentKey);

  // If we found existing traits then return null (to try again), else return the current item
  return existing === undefined || existing === null ? current : null;
}
