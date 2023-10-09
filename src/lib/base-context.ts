import { ZodTypeAny } from "zod";
import { SchemaTableOf, ZodKindedAny, ZodKindOf } from "./types";
import { SchemaInspector, SchemaNodeInspector } from "./schema-inspector";
import { Stack } from "immutable";

export type Recurse<
    SchemaTable extends SchemaTableOf<SchemaTable>,
    OutTable extends OutTableOf<SchemaTable>,
    Ctx
> = <Node extends ZodKindedAny>(
    this: Ctx,
    node: SchemaNodeInspector<SchemaTable, Node>
) => getOutputTypeOrDefault<Node, OutTable>;

export interface BaseContextDef<
    SchemaTable extends SchemaTableOf<SchemaTable>
> {
    readonly path: Stack<SchemaInspector<SchemaTable, any>>;
}

export abstract class BaseContext<
    SchemaTable extends SchemaTableOf<SchemaTable>,
    OutTable extends OutTableOf<SchemaTable>,
    Ctx,
    Def extends BaseContextDef<SchemaTable> = any
> {
    __SchemaTable__!: SchemaTable;
    __OutTable__!: OutTable;

    constructor(
        readonly _recurse: Recurse<SchemaTable, OutTable, Ctx>,
        readonly _def: Def
    ) {}

    protected abstract _with(D: Partial<Def>): Ctx;

    get parents() {
        return this._def.path.pop();
    }

    recurse<ZodSome extends ZodKindedAny>(
        node: ZodSome
    ): getOutputTypeOrDefault<ZodSome, OutTable> {
        const inspected = new SchemaNodeInspector(node as any);
        const child = this._with({
            ...this._def,
            path: this._def.path.push(inspected)
        });
        const _recurse = this._recurse<ZodSome>;
        return _recurse.call(child, inspected);
    }
}

export type MatcherCases<Ctx extends BaseContext<any, any, Ctx>> = {
    [Key in keyof Ctx["__SchemaTable__"]]?: (
        this: Ctx,
        node: SchemaInspector<Ctx["__SchemaTable__"], Key>
    ) => Ctx["__OutTable__"][Key];
} & {
    else: (
        this: Ctx,
        node: SchemaNodeInspector<Ctx["__SchemaTable__"], ZodKindedAny>
    ) => Ctx["__OutTable__"]["else"];
};

export type OutTableOf<SchemaTable> = {
    [K in keyof SchemaTable]?: unknown;
} & {
    else: unknown;
};

export type getOutputTypeOrDefault<
    ZSChema extends ZodTypeAny,
    OutTable extends OutTableOf<OutTable>
> = ZodKindOf<ZSChema> extends keyof OutTable
    ? OutTable[ZodKindOf<ZSChema>]
    : OutTable["else"];
