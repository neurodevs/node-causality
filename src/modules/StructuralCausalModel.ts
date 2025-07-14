export default class StructuralCausalModel implements CausalModel {
    public static Class?: CausalModelConstructor

    private readonly U: Set<ExternalVariable>
    private readonly V: Set<InternalVariable>
    private readonly F: Set<CausalMechanism>

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
        const modifiedF = new Set<CausalMechanism>(this.F)

        Fx.forEach(({ dependent, value }) => {
            const mechanism = Array.from(modifiedF).find(
                (m) => m.dependent.name === dependent.name
            )!

            modifiedF.delete(mechanism)

            const modified: CausalMechanism = {
                dependent,
                function: (_variables) => {
                    return value
                },
            }

            modifiedF.add(modified)
        })

        return StructuralCausalModel.Create({
            U: this.U,
            V: this.V,
            F: modifiedF,
        })
    }

    public toTriple() {
        return {
            U: this.U,
            V: this.V,
            F: this.F,
        }
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
