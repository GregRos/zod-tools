import { ZodTypeAny } from "zod";
import { KindedAny, InTableOf, ZodKindedAny, ZodKindOf } from "./types";
import { SchemaInspector, SchemaNodeInspector } from "./schema-inspector";
import { Stack } from "immutable";

export type Recurse<
    InTable extends InTableOf<InTable>,
    OutTable extends OutTableOf<InTable>,
    Ctx
> = <Node extends KindedAny>(
    this: Ctx,
    node: SchemaNodeInspector<InTable, Node>
) => getOutputTypeOrDefault<Node, OutTable>;

export interface BaseContextDef<InTable extends InTableOf<InTable>> {
    readonly path: Stack<SchemaInspector<InTable, any>>;
}

export abstract class BaseContext<
    InTable extends InTableOf<InTable>,
    OutTable extends OutTableOf<InTable>,
    Ctx,
    Def extends BaseContextDef<InTable> = any
> {
    __SchemaTable__!: InTable;
    __OutTable__!: OutTable;

    constructor(
        readonly _recurse: Recurse<InTable, OutTable, Ctx>,
        readonly _def: Def
    ) {}

    protected abstract _with(D: Partial<Def>): Ctx;

    get parents() {
        return this._def.path.pop();
    }

    recurse<ZodSome extends KindedAny>(
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
        node: SchemaNodeInspector<Ctx["__SchemaTable__"], KindedAny>
    ) => Ctx["__OutTable__"]["else"];
};

export type OutTableOf<OuTable> = {
    [K in keyof OuTable]?: unknown;
} & {
    else: unknown;
};

export type getOutputTypeOrDefault<
    ZSChema extends KindedAny,
    OutTable extends OutTableOf<OutTable>
> = ZodKindOf<ZSChema> extends keyof OutTable
    ? OutTable[ZodKindOf<ZSChema>]
    : OutTable["else"];
