import { Command, flags } from '@oclif/command';
import * as ProgressBar from 'progress';
import * as signale from 'signale';

export default class Hello extends Command {
  static description = 'describe the command here';

  static examples = [
    `$ cryptopi-meta hello
hello world from ./src/hello.ts!
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  };

  static args = [{ name: 'file' }];

  async run() {
    const { args, flags } = this.parse(Hello);

    const bar = new ProgressBar(':bar', { total: 10 });

    const timer = setInterval(() => {
      bar.tick();
      if (bar.complete) {
        signale.success(' complete');
        clearInterval(timer);
      }
    }, 100);

    const name = flags.name ?? 'world';
    this.log(`hello ${name} from ./src/commands/hello.ts`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}
