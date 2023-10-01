import { ZodTypeAny } from "zod";
import { SchemaTableOf, ZodKindedAny, ZodKindOf } from "./types";
import { SchemaInspector, SchemaNodeInspector } from "./schema-inspector";

class MatcherCtx {
    constructor(members: Record<string, any>) {
        Object.assign(this, members);
    }
}

export class MatcherCore<
    SchemaTable extends SchemaTableOf,
    OutTable extends OutTableOf<SchemaTable>,
    ExtraCtx extends object
> {
    private _cases: MatcherCases<SchemaTable, OutTable, ExtraCtx>;

    constructor(
        cases: MatcherCases<SchemaTable, OutTable, ExtraCtx>,
        private _extra: ExtraCtx
    ) {
        if (!cases.else) {
            throw new Error("Visitor must have an 'else' case.");
        }
        this._cases = cases;
    }

    run<ZodSome extends ZodKindedAny>(
        start: ZodSome
    ): getOutputTypeOrDefault<ZodSome, OutTable> {
        let current!: SchemaInspector<any, any>;
        const _match = (
            node: ZodTypeAny,
            ctx: MatcherContext<SchemaTable, OutTable, ExtraCtx>
        ): any => {
            const inspected = new SchemaNodeInspector(node as any);
            const typeName = inspected._def.typeName;
            const handler = (this._cases as any)[typeName];
            current = inspected;
            if (handler) {
                return handler(inspected, ctx);
            }
            return this._cases.else(inspected as any, ctx) as any;
        };

        const ctx = new MatcherCtx({
            parents: [] as SchemaInspector<SchemaTable, any>[],
            recurse<ZodSome extends ZodKindedAny>(
                node: ZodSome
            ): getOutputTypeOrDefault<ZodSome, OutTable> {
                try {
                    this.parents.push(current);
                    current = new SchemaNodeInspector(node as any);
                    return _match(node, ctx as any);
                } finally {
                    this.parents.pop();
                }
            },
            ...this._extra
        });

        return _match(start, ctx as any);
    }
}

export type MatcherContext<
    SchemaTable extends SchemaTableOf,
    OutTable extends OutTableOf<SchemaTable>,
    ExtraCtx extends object
> = {
    readonly parents: SchemaInspector<SchemaTable, any>[];
    recurse<ZodSome extends ZodKindedAny>(
        node: ZodSome
    ): getOutputTypeOrDefault<ZodSome, OutTable>;
} & ExtraCtx;

export type MatcherCases<
    SchemaTable extends SchemaTableOf<string>,
    OutTable extends OutTableOf<SchemaTable>,
    ExtraCtx extends object
> = {
    [Key in Exclude<keyof OutTable & string, "else">]: (
        node: SchemaInspector<SchemaTable, Key>,
        ctx: MatcherContext<SchemaTable, OutTable, ExtraCtx>
    ) => OutTable[Key];
} & {
    else: (
        node: SchemaInspector<SchemaTable, string>,
        ctx: MatcherContext<SchemaTable, OutTable, ExtraCtx>
    ) => OutTable["else"];
};

export type OutTableOf<SchemaTable extends SchemaTableOf> = {
    [K in keyof SchemaTable]?: unknown;
} & {
    else: unknown;
};

export type getOutputTypeOrDefault<
    ZSChema extends ZodTypeAny,
    OutTable extends OutTableOf<SchemaTableOf>
> = ZodKindOf<ZSChema> extends keyof OutTable
    ? OutTable[ZodKindOf<ZSChema>]
    : OutTable["else"];
