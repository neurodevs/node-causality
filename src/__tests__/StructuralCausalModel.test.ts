import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import StructuralCausalModel, {
    CausalModel,
    CausalModelOptions,
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
    protected static async toTripleMethodReturnsCorrectTriple() {
        const triple = this.instance.toTriple()

        assert.isEqualDeep(
            triple,
            this.expectedTriple,
            'Triple does not equal expected!'
        )
    }

    private static expectedTriple: CausalModelOptions = {
        U: new Set(),
        V: new Set(),
        F: new Set(),
    }

    private static StructuralCausalModel() {
        return StructuralCausalModel.Create(this.expectedTriple)
    }
}
