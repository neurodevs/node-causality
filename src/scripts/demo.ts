import StructuralCausalModel from '../modules/StructuralCausalModel'

const u = [{ name: 'U1' }, { name: 'U2' }]
const U = new Set(u)

const v = [{ name: 'V1' }, { name: 'V2' }]
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
])

const instance = StructuralCausalModel.Create({
    U,
    V,
    F,
})

console.log(instance.toTriple())

const submodel = instance.toSubmodel(
    new Set([
        {
            dependent: v[0],
            value: 1,
        },
        {
            dependent: v[1],
            value: 2,
        },
    ])
)

const submodelTriple = submodel.toTriple()
console.log(submodelTriple)

console.log(
    Array.from(submodelTriple.F).map(
        (f) => `${f.dependent.name} = ${f.function({} as any)}`
    )
)
