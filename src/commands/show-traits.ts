import Command from '@oclif/command';
import * as fs from 'fs';
import signale = require('signale');

export class ShowTraitsCommand extends Command {
  static args = [
    {
      name: 'traits',
      required: true,
      description: 'The path to the Traits files.',
    },
    {
      name: 'number',
      required: true,
      description: 'The number of the traits to show',
    },
  ];
  async run() {
    const { args } = this.parse(ShowTraitsCommand);

    const traits = JSON.parse(fs.readFileSync(args.traits).toString());

    const trait = traits[args.number - 1];
    signale.info('Trait: ', trait);
  }
}
