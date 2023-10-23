import { ZodTypeAny } from "zod";
import { KindedAny, InTableOf, ZodKindedAny, ZodKindOf } from "./types";
import { SchemaInspector, NodeInspector } from "./schema-inspector";
import { Stack } from "immutable";

export type RecursiveTransform<
    InTable extends InTableOf<InTable>,
    OutTable extends OutTableOf<InTable>,
    Ctx
> = <Node extends KindedAny>(
    this: Ctx,
    node: NodeInspector<InTable, Node>
) => getOutputTypeOrDefault<Node, OutTable>;

export interface RecursionContextDef<
    Ctx extends BaseRecursionContext<any, any, Ctx>
> {
    readonly recurse: RecursiveTransform<
        Ctx["__InTable__"],
        Ctx["__OutTable__"],
        Ctx
    >;
    readonly path: Stack<NodeInspector<Ctx["__InTable__"], KindedAny>>;
}

export interface RecursionContextConstructor<
    Ctx extends BaseRecursionContext<any, any, Ctx>
> {
    new (def: RecursionContextDef<Ctx>): Ctx;
}

export abstract class BaseRecursionContext<
    InTable extends InTableOf<InTable>,
    OutTable extends OutTableOf<InTable>,
    Ctx extends BaseRecursionContext<InTable, OutTable, Ctx, Def>,
    Def extends RecursionContextDef<Ctx> = RecursionContextDef<Ctx>
> {
    __InTable__!: InTable;
    __OutTable__!: OutTable;

    readonly _def: Def;
    get current() {
        return this._def.path.peek();
    }

    constructor(recurse: Def | RecursiveTransform<InTable, OutTable, Ctx>) {
        if (recurse instanceof Function) {
            this._def = {
                recurse,
                path: Stack()
            } as any;
        } else {
            this._def = recurse;
        }
    }

    protected _child(next: NodeInspector<InTable, KindedAny>) {
        return new (this.constructor as any)({
            ...this._def,
            path: this._def.path.push(next)
        });
    }

    recurse<ZodSome extends KindedAny>(
        node: ZodSome
    ): getOutputTypeOrDefault<ZodSome, OutTable> {
        const inspected = new NodeInspector(node as any);
        const child = this._child(inspected);
        const _recurse = this._def.recurse<ZodSome>;
        return _recurse.call(child, inspected);
    }
}

export type MatchCases<Ctx extends BaseRecursionContext<any, any, Ctx>> = {
    [Key in keyof Ctx["__InTable__"]]?: (
        this: Ctx,
        node: SchemaInspector<Ctx["__InTable__"], Key>
    ) => Ctx["__OutTable__"][Key];
} & {
    else: (
        this: Ctx,
        node: NodeInspector<Ctx["__InTable__"], KindedAny>
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

export function createRecurseFunction<
    InTable extends InTableOf<InTable>,
    OutTable extends OutTableOf<InTable>,
    Ctx extends BaseRecursionContext<InTable, OutTable, Ctx>
>(cases: MatchCases<Ctx>) {
    const recurse: RecursiveTransform<InTable, Ctx["__OutTable__"], Ctx> =
        function (this: Ctx, node) {
            if (node.kind in cases) {
                return (cases as any)[node.kind].call(this, node);
            }
            return cases.else.call(this, node);
        };
    const context = new contextCtor({
        recurse
    });
    return context;
}
