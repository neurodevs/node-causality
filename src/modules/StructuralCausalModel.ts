export default class StructuralCausalModel implements CausalModel {
    public static Class?: CausalModelConstructor

    private readonly U: Set<ExternalVariable>
    private readonly V: Set<InternalVariable>
    private readonly F: Set<CausalMechanism>

    private currentF?: Set<CausalMechanism>
    private currentFx?: Set<MechanismModification>

    protected constructor(options: CausalModelOptions) {
        const { U, V, F } = options

        this.U = U
        this.V = V
        this.F = F
    }

    public static Create(options: CausalModelOptions) {
        return new (this.Class ?? this)(options)
    }

    public toSubmodel(Fx: Set<MechanismModification>): CausalModel {
        this.currentF = this.F
        this.currentFx = Fx

        this.doMechanismModifications()

        const submodel = this.createSubmodel()

        delete this.currentF
        delete this.currentFx

        return submodel
    }

    private doMechanismModifications() {
        this.currentFx!.forEach(({ dependent, value }) => {
            const { name } = dependent

            const mechanism = this.f.find((m) => m.dependent.name === name)!

            this.currentF!.delete(mechanism)

            this.currentF!.add({
                dependent,
                function: (_variables) => value,
            })
        })
    }

    private createSubmodel() {
        return StructuralCausalModel.Create({
            U: this.U,
            V: this.V,
            F: this.currentF!,
        })
    }

    public toTriple() {
        return {
            U: this.U,
            V: this.V,
            F: this.F,
        }
    }

    private get f() {
        return this.toArray(this.F)
    }

    private toArray<T>(set: Set<T>) {
        return Array.from(set)
    }
}

export interface CausalModel {
    toSubmodel(Fx: Set<MechanismModification>): CausalModel
    toTriple(): CausalModelTriple
}

export interface CausalModelOptions extends CausalModelTriple {}

export interface CausalModelTriple {
    U: Set<ExternalVariable>
    V: Set<InternalVariable>
    F: Set<CausalMechanism>
}

export interface Variable {
    name: string
}

export interface ExternalVariable extends Variable {}

export interface InternalVariable extends Variable {}

export interface CausalMechanism {
    dependent: InternalVariable
    function: (variables: Set<Variable>) => number
}

export interface MechanismModification {
    dependent: InternalVariable
    value: number
}

export type CausalModelConstructor = new (
    options: CausalModelOptions
) => CausalModel
