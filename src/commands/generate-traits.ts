import { Command, flags } from '@oclif/command';
import * as signale from 'signale';
import {
  TRAIT_TYPE,
  TRAIT_TIER,
  MANDATORY_TRAIT_ZONES,
} from '../model/constants';
import * as Chance from 'chance';
import * as fs from 'fs';
import { TierProbabilities } from '../model/TierProbabilities';
import rules from '../rules';
import cli from 'cli-ux';
import { performance } from 'perf_hooks';

const NUM_REQUIRED = 9001;

const chance = new Chance();

function getTraitArray(type: TRAIT_TYPE, traits: any) {
  return Object.values(TRAIT_TIER).flatMap((tier) => traits[type][tier]);
}

function getWeightedArray(
  type: TRAIT_TYPE,
  tierProbabilities: TierProbabilities,
  traits: any
) {
  const weightedArray: Array<number> = [];

  Object.values(TRAIT_TIER)
    .map((tier) => tier as TRAIT_TIER)
    .forEach((tier) => {
      if (traits[type][tier]) {
        traits[type][tier].forEach(() => {
          weightedArray.push(tierProbabilities[tier]);
        });
      }
    });

  return weightedArray;
}

function getTraitTier(type: TRAIT_TYPE, trait: string, traits: any) {
  if (
    traits[type][TRAIT_TIER.TIER_1] &&
    traits[type][TRAIT_TIER.TIER_1].indexOf(trait) >= 0
  ) {
    return TRAIT_TIER.TIER_1;
  }
  if (
    traits[type][TRAIT_TIER.TIER_2] &&
    traits[type][TRAIT_TIER.TIER_2].indexOf(trait) >= 0
  ) {
    return TRAIT_TIER.TIER_2;
  }
  if (
    traits[type][TRAIT_TIER.TIER_3] &&
    traits[type][TRAIT_TIER.TIER_3].indexOf(trait) >= 0
  ) {
    return TRAIT_TIER.TIER_3;
  }

  throw new Error(`Trait not found: ${type}:${trait}`);
}

function getTrait(
  type: TRAIT_TYPE,
  traitArray: Array<string>,
  weightedArray: Array<number>
): string {
  let mandatoryMultiplier = 0; // A multiplier for whether a zone is mandatory or not.
  if (MANDATORY_TRAIT_ZONES.indexOf(type) >= 0) {
    // Make sure something is selected for a mandatory trait type
    let selectedTrait = chance.weighted(traitArray, weightedArray);
    while (!selectedTrait) {
      selectedTrait = chance.weighted(traitArray, weightedArray);
    }
    return selectedTrait;
  }

  // If not mandatory, there's 50% chance it will be used
  const isSelected = chance.integer({ min: 0, max: 1 });

  return isSelected === 1 ? chance.weighted(traitArray, weightedArray) : '';
}

export default class GenerateTraits extends Command {
  static description =
    'Generates traits using the given trait types (default count is 9001';

  static examples = [
    `$ cryptopi-meta generate-traits trait-types.json -o traits.json -n 9001`,
    `$ cryptopi-meta generate-traits trait-types.json --output traits.json -n 9001`,
    `$ cryptopi-meta generate-traits trait-types.json`,
  ];

  static args = [
    {
      name: 'traitTypesFileName',
      required: true,
      description: 'The path to the Trait types JSON file.',
    },
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    output: flags.string({
      char: 'o',
      description: 'Where to output the resulting JSON to',
    }),
    number: flags.string({
      char: 'n',
      description: 'The number of traits to generate',
    }),
  };

  generateTraits(
    numRequired: number,
    traitTypes: any
  ): { traits: Array<string[]>; generationAttemptCount: number } {
    const tierProbabilities: TierProbabilities = {
      [TRAIT_TIER.TIER_1]: 45,
      [TRAIT_TIER.TIER_2]: 50,
      [TRAIT_TIER.TIER_3]: 15,
    };

    const traits: Array<string[]> = [];
    let generatedCount = 0; // Actual number of generated traits
    let generationAttemptCount = 0; // The total number of iterations in attempting to create traits

    const progressBar = cli.progress({
      format: '  Generating [ {bar} ] {percentage}% | {value}/{total}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
    });

    progressBar.start(numRequired, 0);

    while (generatedCount < numRequired) {
      const selectedTraits: string[] = [];

      Object.values(TRAIT_TYPE)
        .map((type) => type as TRAIT_TYPE)
        .forEach((type) => {
          const traitArray = getTraitArray(type, traitTypes);
          const weightedArray = getWeightedArray(
            type,
            tierProbabilities,
            traitTypes
          );

          const selectedTrait = getTrait(type, traitArray, weightedArray);
          const selectedTraitTier = selectedTrait
            ? getTraitTier(type, selectedTrait, traitTypes)
            : null;

          selectedTraits.push(selectedTrait);

          // if (selectedTraitTier) {
          //   // Update new probabilities based on selection
          //   switch (selectedTraitTier) {
          //     case TRAIT_TIER.TIER_2:
          //       tierProbabilities[TRAIT_TIER.TIER_2] /= 2; // Rare items get increasingly rare.
          //       break;
          //     case TRAIT_TIER.TIER_3:
          //       tierProbabilities[TRAIT_TIER.TIER_2] = 0; // No more chances if you get an extremely rare
          //   }
          // }
        });

      let validatedTraits: string[] | null = selectedTraits;
      rules.forEach((rule) => {
        validatedTraits = rule(validatedTraits as string[], traits);
      });

      if (validatedTraits) {
        traits.push(validatedTraits);
        generatedCount += 1;
        progressBar.update(generatedCount);
      }

      generationAttemptCount += 1;
    }

    progressBar.stop();

    return {
      traits,
      generationAttemptCount,
    };
  }

  async run() {
    const { flags, args } = this.parse(GenerateTraits);

    signale.info(`Getting trait-types from ${args.traitTypesFileName}`);

    const traitTypes = JSON.parse(
      fs.readFileSync(args.traitTypesFileName).toString()
    );

    signale.success(' Trait types loaded');

    const t0 = performance.now();

    const numRequired: number = Number(flags.number) || NUM_REQUIRED;

    try {
      const { generationAttemptCount, traits } = this.generateTraits(
        numRequired,
        traitTypes
      );

      const t1 = performance.now();

      let outputFile = 'traits.json';
      if (flags.output) {
        outputFile = flags.output;
      }

      signale.info(`Writing traits to ${outputFile}`);

      fs.writeFileSync(outputFile, JSON.stringify(traits));

      signale.success(' Trait Generation complete');
      signale.info('Total Time: ', Math.round(t1 - t0));
      signale.info('Total Iterations: ', generationAttemptCount);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
