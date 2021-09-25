import { Command, flags } from '@oclif/command';
import * as signale from 'signale';
import { TRAIT_TYPE, TRAIT_TIER } from '../model/constants';
import * as Chance from 'chance';
import * as fs from 'fs';

const NUM_REQUIRED = 9001;

const chance = new Chance();

function getTraitArray(zone, traits) {
  return Object.values(TRAIT_TIER).flatMap((tier) => traits[zone][tier]);
}

function getWeightedArray(zone, tierProbabilities) {
  const weightedArray = [];

  Object.keys(TRAIT_TIERS).forEach((tier) => {
    traits[zone][tier].forEach((trait) => {
      weightedArray.push(tierProbabilities[tier]);
    });
  });

  return weightedArray;
}

function getTraitTier(zone, trait) {
  if (traits[zone][TRAIT_TIERS.TIER_1].indexOf(trait) >= 0) {
    return TRAIT_TIERS.TIER_1;
  }
  if (traits[zone][TRAIT_TIERS.TIER_2].indexOf(trait) >= 0) {
    return TRAIT_TIERS.TIER_2;
  }
  if (traits[zone][TRAIT_TIERS.TIER_3].indexOf(trait) >= 0) {
    return TRAIT_TIERS.TIER_3;
  }

  throw new Error(`Trait not found: ${zone}:${trait}`);
}

function getTrait(zone, traitArray, weightedArray) {
  let mandatoryMultiplier = 0; // A multiplier for whether a zone is mandatory or not.
  if (MANDATORY_TRAIT_ZONES.indexOf(TRAIT_ZONES[zone]) >= 0) {
    mandatoryMultiplier = 1; // If mandatory, the multiplier is always 1
  } else {
    // If not mandatory, there's 50% chance it will be used
    mandatoryMultiplier = chance.integer({ min: 0, max: 1 });
  }

  const selectedTrait = chance.weighted(traitArray, weightedArray);
  return mandatoryMultiplier === 1 ? selectedTrait : '';
}
