import { TRAIT_TIER } from "./constants";

export type TierProbabilities = {
    [TRAIT_TIER.TIER_1]: number;
    [TRAIT_TIER.TIER_2]: number,
    [TRAIT_TIER.TIER_3]: number,
  };