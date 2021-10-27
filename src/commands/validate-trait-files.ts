import Command from '@oclif/command';
import * as fs from 'fs';
import signale = require('signale');

export class ValidateTraitFilesCommand extends Command {
  static args = [
    {
      name: 'traitTypes',
      required: true,
      description: 'The path to the Trait types JSON file.',
    },
    {
      name: 'assetsPath',
      required: true,
      description: 'The path to the Trait asset files.',
    },
  ];

  async run() {
    const { args } = this.parse(ValidateTraitFilesCommand);

    const traitTypes = JSON.parse(fs.readFileSync(args.traitTypes).toString());

    const missingTraits = [];

    Object.keys(traitTypes).forEach((type) => {
      Object.keys(traitTypes[type]).forEach((tier) => {
        traitTypes[type][tier]
          .filter((trait) => trait)
          .forEach((trait) => {
            const fileName = `${args.assetsPath}/${trait
              .replace(/\s/g, '_')
              .replace(/\'/g, '_')}.png`;
            signale.info('Validating file: ', fileName);
            if (!fs.existsSync(fileName)) {
              missingTraits.push(`${type}:${tier}:${trait}`);
            }
          });
      });
    });

    if (missingTraits.length === 0) {
      signale.info('No missing traits');
    } else {
      signale.info('Missing traits:');
      signale.info(missingTraits);
    }
  }
}
