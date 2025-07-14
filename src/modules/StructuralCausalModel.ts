export default class StructuralCausalModel implements CausalModel {
    public static Class?: CausalModelConstructor

    private U: Set<ExternalVariable>
    private V: Set<InternalVariable>
    private F: Set<CausalMechanism>

    protected constructor(options: CausalModelOptions) {
        const { U, V, F } = options

        this.U = U
        this.V = V
        this.F = F
    }

    public static Create(options: CausalModelOptions) {
        return new (this.Class ?? this)(options)
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
    toTriple(): CausalModelOptions
}

export interface CausalModelOptions {
    U: Set<ExternalVariable>
    V: Set<InternalVariable>
    F: Set<CausalMechanism>
}

export interface ExternalVariable {}

export interface InternalVariable {}

export interface CausalMechanism {}

export type CausalModelConstructor = new () => CausalModel
