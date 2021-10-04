import * as fs from 'fs';

export class ProgressLog {
  name: string;

  currentIndex: number;

  constructor(name: string, currentIndex?: number) {
    this.name = name;
    this.currentIndex = currentIndex || 0;
  }

  increment() {
    this.currentIndex += 1;
    this.save();
  }

  getFileName() {
    return `${this.name}.json`;
  }

  save() {
    fs.writeFileSync(
      this.getFileName(),
      JSON.stringify({ name: this.name, currentIndex: this.currentIndex })
    );
  }

  load(fileName: string) {
    const json = fs.readFileSync(fileName);
    const o = JSON.parse(json.toString());

    return new ProgressLog(o.name, o.currentIndex);
  }
}
