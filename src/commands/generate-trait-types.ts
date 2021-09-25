import { Command, flags } from '@oclif/command';
import * as signale from 'signale';
import { TRAIT_TYPE, TRAIT_TIER } from '../model/constants';
import * as Chance from 'chance';
import * as fs from 'fs';

const chance = new Chance();
const usedTraits: string[] = [];

const getTrait = (): string => {
  const trait = chance.word();
  if (usedTraits.indexOf(trait) < 0) {
    usedTraits.push(trait);
    return trait;
  }

  return getTrait();
};

export default class GenerateTraitTypes extends Command {
  static description = 'Generates random trait types for testing';

  static examples = [
    `$ cryptopi-meta generate-trait-types -o new-traits.json`,
    `$ cryptopi-meta generate-trait-types --output new-traits.json`,
    `$ cryptopi-meta generate-trait-types`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    output: flags.string({
      char: 'o',
      description: 'Where to output the resulting JSON to',
    }),
  };

  async run() {
    const { flags } = this.parse(GenerateTraitTypes);

    const traits: any = {};

    Object.values(TRAIT_TYPE)
      .map((type) => type as TRAIT_TYPE)
      .forEach((type) => {
        if (!(type in traits)) {
          traits[type] = {};
          Object.values(TRAIT_TIER)
            .map((tier) => tier as TRAIT_TIER)
            .forEach((tier) => {
              traits[type][tier] = [];
            });
        }

        for (let i = 0; i < 15; i++) {
          traits[type][TRAIT_TIER.TIER_1].push(getTrait());
        }
        for (let i = 15; i < 19; i++) {
          traits[type][TRAIT_TIER.TIER_2].push(getTrait());
        }
        traits[type][TRAIT_TIER.TIER_3]?.push(getTrait());
      });

    let outputFile = 'trait-types.json';
    if (flags.output) {
      outputFile = flags.output;
    }

    signale.info(`Writing traits to ${outputFile}`);

    fs.writeFileSync(outputFile, JSON.stringify(traits));

    signale.success(' complete');
  }
}
