import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import StructuralCausalModel, {
    CausalMechanism,
    CausalModel,
    CausalModelOptions,
    ExternalVariable,
    InternalVariable,
    MechanismModification,
} from '../modules/StructuralCausalModel'

export default class StructuralCausalModelTest extends AbstractSpruceTest {
    private static instance: CausalModel

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.StructuralCausalModel()
    }

    @test()
    protected static async createsInstance() {
        assert.isTruthy(this.instance, 'Could not create instance!')
    }

    @test()
    protected static async passingEmptySetToFxInToSubmodelReturnsFullModel() {
        const emptySet = this.createEmptySet<MechanismModification>()
        const submodel = this.instance.toSubmodel(emptySet)

        assert.isEqualDeep(
            submodel,
            this.instance,
            'Should return the full model!'
        )
    }

    @test()
    protected static async toTripleMethodReturnsCorrectTriple() {
        const triple = this.instance.toTriple()

        assert.isEqualDeep(
            triple,
            this.expectedTriple,
            'Triple does not equal expected!'
        )
    }

    private static expectedTriple: CausalModelOptions = {
        U: this.createEmptySet<ExternalVariable>(),
        V: this.createEmptySet<InternalVariable>(),
        F: this.createEmptySet<CausalMechanism>(),
    }

    private static createEmptySet<T>() {
        return new Set<T>()
    }

    private static StructuralCausalModel() {
        return StructuralCausalModel.Create(this.expectedTriple)
    }
}
