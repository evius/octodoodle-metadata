import { Command, flags } from '@oclif/command';
import * as signale from 'signale';
import { TRAIT_TYPE, TRAIT_TIER, MANDATORY_TRAIT_ZONES, TRAIT_TYPE_KEYS } from '../model/constants';
import * as Chance from 'chance';
import * as fs from 'fs';
import { TierProbabilities } from '../model/TierProbabilities';
import rules from '../rules';
const { performance } = require('perf_hooks');

const NUM_REQUIRED = 9001;

const chance = new Chance();

function getTraitArray(type: TRAIT_TYPE, traits: any) {
  return Object.values(TRAIT_TIER).flatMap((tier) => traits[type][tier]);
}

function getWeightedArray(type: TRAIT_TYPE, tierProbabilities: TierProbabilities, traits: any) {
  const weightedArray: Array<number> = [];

  Object.values(TRAIT_TIER)
      .map((tier) => tier as TRAIT_TIER)
      .forEach((tier) => {
    traits[type][tier].forEach(() => {
      weightedArray.push(tierProbabilities[tier]);
    });
  });

  return weightedArray;
}

function getTraitTier(type: TRAIT_TYPE, trait: string, traits: any) {
  if (traits[type][TRAIT_TIER.TIER_1].indexOf(trait) >= 0) {
    return TRAIT_TIER.TIER_1;
  }
  if (traits[type][TRAIT_TIER.TIER_2].indexOf(trait) >= 0) {
    return TRAIT_TIER.TIER_2;
  }
  if (traits[type][TRAIT_TIER.TIER_3].indexOf(trait) >= 0) {
    return TRAIT_TIER.TIER_3;
  }

  throw new Error(`Trait not found: ${type}:${trait}`);
}

function getTrait(type: TRAIT_TYPE, traitArray: Array<string>, weightedArray: Array<number>): string {
  let mandatoryMultiplier = 0; // A multiplier for whether a zone is mandatory or not.
  if (MANDATORY_TRAIT_ZONES.indexOf(type) >= 0) {
    mandatoryMultiplier = 1; // If mandatory, the multiplier is always 1
  } else {
    // If not mandatory, there's 50% chance it will be used
    mandatoryMultiplier = chance.integer({ min: 0, max: 1 });
  }

  const selectedTrait = chance.weighted(traitArray, weightedArray);
  return mandatoryMultiplier === 1 ? selectedTrait : '';
}

export default class GenerateTraits extends Command {
  static description = 'Generates traits using the given trait types (default count is 9001';

  static examples = [
    `$ cryptopi-meta generate-traits trait-types.json -o traits.json -n 9001`,
    `$ cryptopi-meta generate-traits trait-types.json --output traits.json -n 9001`,
    `$ cryptopi-meta generate-traits trait-types.json`,
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

  async run() {
    const { flags } = this.parse(GenerateTraits);

    const traits: any = {};

    const t0 = performance.now();

  let generatedCount = 0; // Actual number of generated traits
  let generationAttemptCount = 0; // The total number of iterations in attempting to create traits

  const tierProbabilities: TierProbabilities = {
    [TRAIT_TIER.TIER_1]: 69,
    [TRAIT_TIER.TIER_2]: 30,
    [TRAIT_TIER.TIER_3]: 1,
  };

  while (generatedCount < NUM_REQUIRED) {
    const selectedTraits: string[] = [];

    Object.values(TRAIT_TYPE)
      .map((type) => type as TRAIT_TYPE)
      .forEach((type) => {
      const traitArray = getTraitArray(type, traits);
      const weightedArray = getWeightedArray(type, tierProbabilities, traits);

      const selectedTrait = getTrait(type, traitArray, weightedArray);
      const selectedTraitTier = selectedTrait
        ? getTraitTier(type, selectedTrait, traits)
        : null;

      selectedTraits.push(selectedTrait);

      if (selectedTraitTier) {
        // Update new probabilities based on selection
        switch (selectedTraitTier) {
          case TRAIT_TIER.TIER_2:
            tierProbabilities[TRAIT_TIER.TIER_2] /= 2; // Rare items get increasingly rare.
            break;
          case TRAIT_TIER.TIER_3:
            tierProbabilities[TRAIT_TIER.TIER_2] = 0; // No more chances if you get an extremely rare
        }
      }
    });

    let validatedTraits: string[] | null = selectedTraits;
    rules.forEach((rule) => {
      validatedTraits = rule(validatedTraits as string[], traits);
    });

    if (validatedTraits) {
      traits.push(validatedTraits);
      generatedCount++;
    }

    generationAttemptCount++;
  }

    let outputFile = 'traits.json';
    if (flags.output) {
      outputFile = flags.output;
    }

    signale.info(`Writing traits to ${outputFile}`);

    fs.writeFileSync(outputFile, JSON.stringify(traits));

    signale.success(' complete');
  }
}