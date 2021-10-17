export enum TRAIT_TIER {
  TIER_1 = 'Tier 1', // Common
  TIER_2 = 'Tier 2', // Rare
  TIER_3 = 'Tier 3', // Extremely Rare
  // TIER_4 = 'Tier 4', // One of a kind
}

export enum TRAIT_TYPE {
  BACKGROUND = 'Background',
  SKIN = 'Skin',
  MOUTH = 'Mouth',
  SUCKERS = 'Suckers',
  EYES = 'Eyes',
  CLOTHING = 'Clothing',
  HEAD = 'Head',
  TENTACLE_1 = 'Tentacle 1',
  TENTACLE_2 = 'Tentacle 2',
}

export const TRAIT_TYPE_KEYS = Object.keys(TRAIT_TYPE).filter(
  (x) => !(parseInt(x, 10) >= 0)
);

export const MANDATORY_TRAIT_ZONES = [
  TRAIT_TYPE.BACKGROUND,
  TRAIT_TYPE.SKIN,
  TRAIT_TYPE.MOUTH,
  TRAIT_TYPE.EYES,
];
