import StructuralCausalModel from '../modules/StructuralCausalModel'

const u = [
    { name: 'U1: C-tactile stimulus (left forearm)' },
    { name: 'U2: C-tactile stimulus (right forearm)' },
    { name: 'U3: Vestibular stimulus (head tilt angle)' },
    { name: 'U4: Thermal stimulus (environmental temperature)' },
    { name: 'U5: Visual stimulus (eyes open or closed)' },
]
const U = new Set(u)

const v = [
    { name: 'V1: Source-localized EEG in posterior insular cortex' },
    { name: 'V2: Source-localized EEG in midcingulate cortex' },
    { name: 'V3: Spike-triggered EMG averaging in forearm lead' },
]
const V = new Set(v)

const F = new Set([
    {
        dependent: v[0],
        function: (_variables: any) => 0,
    },
    {
        dependent: v[1],
        function: (_variables: any) => 0,
    },
    {
        dependent: v[2],
        function: (_variables: any) => 0,
    },
])

const model = StructuralCausalModel.Create({
    U,
    V,
    F,
})

const modelTriple = model.toTriple()

const Fx = new Set([
    {
        dependent: v[0],
        value: 1,
    },
])

const submodel = model.toSubmodel(Fx)

let submodelTriple = submodel.toTriple()

const printableModel = {
    U: modelTriple.U,
    V: modelTriple.V,
    F: new Set(
        Array.from(modelTriple.F)
            .sort((a, b) => a.dependent.name.localeCompare(b.dependent.name))
            .map((f) => ({
                dependent: f.dependent.name.split(': ')[0],
                function: `(u, v) => f(u, v)`,
            }))
    ),
}

console.log(
    '\nA causal model is a triple M = ⟨ U, V, F ⟩. For a simplified example of the I-INSULA protocol:\n\n',
    'M =',
    printableModel,
    '\n\nWhere:\n',
    '- U is a set of external variables,\n',
    '- V is a set of internal variables, and\n',
    '- F is a set of causal mechanisms (or mapping functions) from (Ui, PAi) => Vi.\n'
)

const printableSubmodel = {
    U: submodelTriple.U,
    V: submodelTriple.V,
    F: new Set(
        Array.from(submodelTriple.F)
            .sort((a, b) => a.dependent.name.localeCompare(b.dependent.name))
            .map((f) => ({
                dependent: f.dependent.name.split(': ')[0],
                function: `(u, v) => ${f.function({} as any) === 0 ? 'f(u, v)' : f.function({} as any)}`,
            }))
    ),
}

console.log(
    'A submodel of M is the causal model Mx = ⟨ U, V, Fx ⟩ given by action do(X = x):\n',
    '\nFx =',
    Fx,
    '\n\nMx =',
    printableSubmodel,
    '\n\nWhere:\n',
    '- U is the same set of external variables,\n',
    '- V is the same set of internal variables, and\n',
    '- Fx is a set of mechanism modifications for some internal variables in V.\n\n'
)

console.log()
