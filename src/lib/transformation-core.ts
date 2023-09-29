import { ZodTypeAny } from "zod";
import { SchemaTableOf, ZodKindedAny, ZodKindOf } from "./types";
import { SchemaInspector } from "./schema-inspector";

export class TransformationCore<
    SchemaTable extends SchemaTableOf,
    OutTable extends OutTableOf<SchemaTable>
> {
    #cases: TransformationCases<SchemaTable, OutTable>;

    constructor(cases: TransformationCases<SchemaTable, OutTable>) {
        if (!cases.else) {
            throw new Error("Visitor must have an 'else' case.");
        }
        this.#cases = cases;
    }

    run<ZodSome extends ZodKindedAny>(
        node: ZodSome
    ): getOutputTypeOrDefault<ZodSome, OutTable> {
        return TransformationContext.start(node, this.#cases);
    }
}

export class TransformationContext<
    SchemaTable extends SchemaTableOf,
    OutTable extends OutTableOf<SchemaTable>
> {
    public readonly parents = [] as SchemaInspector<SchemaTable, any>[];
    private _current: SchemaInspector<SchemaTable, any>;
    constructor(
        current: ZodKindedAny,
        private readonly _visitor: TransformationCases<SchemaTable, OutTable>
    ) {
        this._current = new SchemaInspector(current as any);
    }

    private _apply(node: ZodTypeAny): any {
        const inspected = new SchemaInspector(node as any);
        const typeName = inspected._def.typeName;
        const cases = this._visitor;
        const handler = (cases as any)[typeName];
        if (handler) {
            return handler(inspected, this);
        }
        return this._visitor.else(inspected as any, this) as any;
    }

    static start<
        SchemaTable extends SchemaTableOf,
        OutTable extends OutTableOf<SchemaTable>,
        ZStart extends ZodKindedAny
    >(
        node: ZStart,
        visitor: TransformationCases<SchemaTable, OutTable>
    ): getOutputTypeOrDefault<ZStart, OutTable> {
        const ctx = new TransformationContext(node, visitor);
        return ctx._apply(node);
    }

    recurse<ZodSome extends ZodKindedAny>(
        node: ZodSome
    ): getOutputTypeOrDefault<ZodSome, OutTable> {
        try {
            this.parents.push(this._current);
            this._current = new SchemaInspector(node as any);
            return this._apply(node);
        } finally {
            this.parents.pop();
        }
    }
}

export type TransformationCases<
    SchemaTable extends SchemaTableOf<string>,
    OutTable extends OutTableOf<SchemaTable>
> = {
    [Key in Exclude<keyof OutTable & string, "else">]: (
        node: SchemaInspector<SchemaTable, Key>,
        ctx: TransformationContext<SchemaTable, OutTable>
    ) => OutTable[Key];
} & {
    else: (
        node: SchemaInspector<SchemaTable, string>,
        ctx: TransformationContext<SchemaTable, OutTable>
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
