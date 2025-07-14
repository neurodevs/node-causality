export default class StructuralCausalModel implements CausalModel {
    public static Class?: CausalModelConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}

export interface CausalModel {}

export type CausalModelConstructor = new () => CausalModel
