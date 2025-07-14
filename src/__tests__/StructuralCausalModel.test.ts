import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import StructuralCausalModel, {
    CausalModel,
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

    private static StructuralCausalModel() {
        return StructuralCausalModel.Create()
    }
}
