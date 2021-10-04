import { JsonSerializable } from "./JsonSerializable";
import { TraitTier } from "./TraitTier";
import { TraitType } from "./TraitType";

export class Trait extends JsonSerializable<Trait> {
    traitType: TraitType;
    traitTier: TraitTier;
    name: string;

    constructor(name: string, traitType: TraitType, traitTier: TraitTier) {
        super();
        this.name = name;
        this.traitType = traitType
        this.traitTier = traitTier;
    }
}