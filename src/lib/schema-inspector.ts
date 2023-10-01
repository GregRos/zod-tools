import { SchemaTableOf, ZodDefOf, ZodKindedAny, ZodKindOf } from "./types";

export type SchemaInspector<
    SchemaTable extends SchemaTableOf,
    Kind extends keyof SchemaTable & string
> = SchemaNodeInspector<SchemaTable, SchemaTable[Kind]>;

/**
 * Use this to inspect a schema node. You can use the `is` method to check if the
 * node is a specific type while narrowing, and you can use the `kind` property to get the type
 * name.
 */
export class SchemaNodeInspector<
    SchemaTable extends SchemaTableOf,
    Node extends ZodKindedAny
> {
    constructor(readonly _node: Node) {}

    /**
     * Gets the `kind` AKA `_def.typeName` of the schema node.
     */
    get kind(): ZodKindOf<Node> {
        return this._def.typeName;
    }

    /**
     * Check if the schema node has a specific Kind. This is a type guard.
     * @param kind The kind to check for.
     */
    is<const SubKind extends keyof SchemaTable & string>(
        kind: SubKind
    ): this is string extends ZodKindOf<Node>
        ? SchemaNodeInspector<SchemaTable, SchemaTable[SubKind]>
        : ZodKindOf<Node> extends SubKind
        ? SchemaNodeInspector<SchemaTable, SchemaTable[SubKind]>
        : never {
        return this._def.typeName === kind;
    }

    /**
     * Gets the `_def` of the schema node.
     */
    get _def(): ZodDefOf<Node> {
        return this._node._def;
    }
}
