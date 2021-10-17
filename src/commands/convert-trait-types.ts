import { Command, flags } from '@oclif/command';
import * as fs from 'fs';
import signale = require('signale');

export class ConvertTraitTypes extends Command {
  static args = [
    {
      name: 'traitTypesToConvert',
      required: true,
      description:
        'The path to the Trait types JSON file (converter FROM CSV) to convert to Trait Types format.',
    },
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    output: flags.string({
      char: 'o',
      description: 'Where to output the resulting JSON to',
    }),
  };

  async run() {
    const { flags, args } = this.parse(ConvertTraitTypes);
    signale.info('Flags: ', flags);
    signale.info('Args: ', args);
    // Load the json file
    const traitTypesToConvert = JSON.parse(
      fs.readFileSync(args.traitTypesToConvert).toString()
    );

    const traitTypes = {};

    traitTypesToConvert.forEach((element) => {
      if (!traitTypes[element.Type]) {
        traitTypes[element.Type] = {};
      }

      if (!traitTypes[element.Type][element.Rareness]) {
        traitTypes[element.Type][element.Rareness] = [];
      }

      traitTypes[element.Type][element.Rareness].push(element.Name);
    });

    fs.writeFileSync(flags.output, JSON.stringify(traitTypes));
  }
}
