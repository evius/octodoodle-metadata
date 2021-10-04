import { JsonSerializable } from "./JsonSerializable";
import { TraitTier } from "./TraitTier";
import { TraitType } from "./TraitType";

export class TraitConfiguration extends JsonSerializable<TraitConfiguration> {
    traitTiers: Array<TraitTier>;
    traitTypes: Array<TraitType>;

    constructor(traitTiers: Array<TraitTier>, traitTypes: Array<TraitType>) {
        super();
        this.traitTiers = traitTiers;
        this.traitTypes = traitTypes;
    }
}