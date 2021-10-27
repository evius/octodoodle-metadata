const scarfs = [
  'Nekerchief',
  'Blue Scarf',
  'Autumn Scarf',
  'Purple Scarf',
  'Wooly Scarf',
];

export function snails(current: string[], generated: string[][]) {
  //If there is a scarf and has snails remove the snails
  if (scarfs.indexOf(current[4]) >= 0 && current[9] === 'Snails') {
    current[9] = '';
  }

  return current;
}
