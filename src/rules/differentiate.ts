const MIN_DIFFERENCES = 6;

export function differentiate(current: string[], generated: string[][]) {
  const currentSet = new Set(current);

  generated.forEach((element) => {
    const existingSet = new Set(element);
    const difference = new Set(
      [...currentSet].filter((x) => !existingSet.has(x))
    );
    if (difference.size < MIN_DIFFERENCES) {
      return null;
    }
  });

  return current;
}
