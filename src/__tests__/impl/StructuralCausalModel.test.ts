import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import generateId from '@neurodevs/generate-id'
import StructuralCausalModel, {
    CausalMechanism,
    CausalModel,
    CausalModelOptions,
    ExternalVariable,
    InternalVariable,
    MechanismModification,
} from '../../impl/StructuralCausalModel'

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
    protected static async toSubmodelWithEmptySetReturnsCopyOfModel() {
        const emptySet = this.createSet<MechanismModification>()
        const submodel = this.instance.toSubmodel(emptySet)

        assert.isEqualDeep(
            submodel,
            this.instance,
            'Should return the full model!'
        )
    }

    @test()
    protected static async toSubmodelWithNonEmptySetReturnsNewSubmodel() {
        const submodel = this.toSubmodel()
        const { U, V, F } = submodel.toTriple()

        assert.isEqualDeep(U, this.U, 'U should be the same!')
        assert.isEqualDeep(V, this.V, 'V should be the same!')

        const { function: f0 } = Array.from(F).find(
            (f) => f.dependent.name === this.v[0].name
        )!

        const { function: f1 } = Array.from(F).find(
            (f) => f.dependent.name === this.v[1].name
        )!

        assert.isEqual(
            f0({} as any),
            1,
            'Should return modified structural equations F!'
        )

        assert.isEqual(
            f1({} as any),
            2,
            'Should return modified structural equations F!'
        )
    }

    @test()
    protected static async toTripleMethodReturnsCorrectTriple() {
        const triple = this.toTriple()

        assert.isEqualDeep(
            triple,
            this.triple,
            'Triple does not equal expected!'
        )
    }

    @test()
    protected static async toSubmodelDoesNotModifyOriginalModel() {
        this.toSubmodel()

        const { F: afterF } = this.toTriple()

        assert.isEqualDeep(
            afterF,
            this.F,
            'Original model should not be modified!'
        )
    }

    private static toSubmodel() {
        return this.instance.toSubmodel(this.Fx)
    }

    private static toTriple() {
        return this.instance.toTriple()
    }

    private static externalVariables: ExternalVariable[] = [
        { name: generateId() },
        { name: generateId() },
    ]

    private static get u() {
        return this.externalVariables
    }

    private static internalVariables: InternalVariable[] = [
        { name: generateId() },
        { name: generateId() },
    ]

    private static get v() {
        return this.internalVariables
    }

    private static causalMechanisms: CausalMechanism[] = [
        {
            dependent: this.v[0],
            function: (_variables) => 0,
        },
        {
            dependent: this.v[1],
            function: (_variables) => 0,
        },
    ]

    private static get f() {
        return this.causalMechanisms
    }

    private static U = this.createSet<ExternalVariable>(this.u)
    private static V = this.createSet<InternalVariable>(this.v)
    private static F = this.createSet<CausalMechanism>(this.f)

    private static triple: CausalModelOptions = {
        U: this.U,
        V: this.V,
        F: this.F,
    }

    private static Fx = this.createSet<MechanismModification>([
        {
            dependent: this.v[0],
            value: 1,
        },

        {
            dependent: this.v[1],
            value: 2,
        },
    ])

    private static createSet<T>(array?: T[]) {
        return new Set<T>(array ?? [])
    }

    private static StructuralCausalModel() {
        return StructuralCausalModel.Create(this.triple)
    }
}
