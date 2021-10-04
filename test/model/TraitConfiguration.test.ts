import { expect } from "chai";
import { TraitConfiguration } from "../../src/model/TraitConfiguration";
import { TraitTier } from "../../src/model/TraitTier";
import { TraitType } from "../../src/model/TraitType";

describe('TraitConfiguration', () => {
    it('generates JSON correctly', () => {
        const traitTiers: Array<TraitTier> = [{ name: 'Test Trait 1' }, { name: 'Test Trait 2'}];
        const traitTypes: Array<TraitType> = [{ name: 'Test Type 1'}, {name: 'Test Type 2'}];

        const traitConfig = new TraitConfiguration(traitTiers, traitTypes);

        expect(traitConfig.toJson()).equals('')
    });
})