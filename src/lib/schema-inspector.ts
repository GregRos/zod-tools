import { SchemaTableOf, ZodDefOf } from "./types";

export class SchemaInspector<
    SchemaTable extends SchemaTableOf,
    Kind extends keyof SchemaTable & string
> {
    constructor(readonly _node: SchemaTable[Kind]) {}

    get kind(): Kind {
        return this._def.typeName as Kind;
    }

    is<const SubtypeKey extends keyof SchemaTable & string>(
        name: SubtypeKey
    ): this is SchemaInspector<SchemaTable, SubtypeKey> {
        return this._def.typeName === name;
    }

    get _def(): ZodDefOf<SchemaTable[Kind]> {
        return this._node._def;
    }
}
