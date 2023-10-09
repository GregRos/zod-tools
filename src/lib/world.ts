import { SchemaTableOf, ZodKindedAny, ZodKindOf } from "./types";
import { SchemaInspector, SchemaNodeInspector } from "./schema-inspector";
import {
    getOutputTypeOrDefault,
    MatcherCases,
    BaseContext,
    OutTableOf,
    Recurse
} from "./base-context";
import { Stack } from "immutable";
import { MatcherContext } from "./default-context";

/**
 * Used in the recursive matcher. Specify the `OutTable` and the match cases,
 * then immediately apply the matcher.
 */
export interface UsingContext<Ctx extends BaseContext<any, any, Ctx>> {
    context(contextCtor: MatcherCases<Ctx>): Ctx;
}

export interface SetCases<Ctx extends BaseContext<any, any, Ctx>> {
    cases(contextCtor: MatcherCases<Ctx>): Ctx;
}

/**
 * Used by the recursive matcher. Specify the `OutTable` and the match cases,
 * getting a reusable matching function in return.
 */
export interface BuildingMatcher<Ctx extends BaseContext<any, any, Ctx>> {
    context(createEmpty: (recurse: Ctx["_recurse"]) => Ctx): UsingContext<Ctx>;
}

export interface TableMatcher<
    SchemaTable extends SchemaTableOf<SchemaTable>,
    OutTable extends OutTableOf<SchemaTable>,
    State extends object
> {
    run<ZodSome extends ZodKindedAny>(
        start: ZodSome,
        ctx: State
    ): getOutputTypeOrDefault<ZodSome, OutTable>;
}

/**
 * Use this if you have custom schema nodes. You need to explicitly specify the
 * `SchemaTable` so the world knows which schemas are included. Then you can create
 * matchers and inspectors that work with your custom schemas.
 */
export class SchemaWorld<SchemaTable extends SchemaTableOf<SchemaTable>> {
    /**
     * Create a schema inspector for a given schema node.
     * @param node The schema node to inspect.
     */
    inspect<Z extends ZodKindedAny>(
        node: Z
    ): SchemaNodeInspector<SchemaTable, Z> {
        return new SchemaNodeInspector(node as any);
    }

    matcher<Ctx extends BaseContext<SchemaTable, any, any>>(
        createEmpty: (recurse: Recurse<SchemaTable, any, any>) => Ctx
    ) {
        return {
            cases(cases: MatcherCases<Ctx>): Ctx {
                const recurse: Recurse<SchemaTable, Ctx["__OutTable__"], Ctx> =
                    function (this: Ctx, node) {
                        if (node.kind in cases) {
                            return (cases as any)[node.kind].call(this, node);
                        }
                        return cases.else.call(this, node);
                    };
                const context = createEmpty(recurse);
                return context;
            }
        };
    }

    match<MatchTarget extends ZodKindedAny>(target: MatchTarget) {
        const world = this;
        return {
            cases<OutTable extends OutTableOf<SchemaTable>>(
                cases: MatcherCases<MatcherContext<SchemaTable, OutTable>>
            ) {
                return world
                    .matcher(
                        recurse =>
                            new MatcherContext<SchemaTable, OutTable>(recurse, {
                                path: Stack()
                            })
                    )
                    .cases(cases)
                    .recurse(target);
            }
        };
    }
}

export function world<
    SchemaTable extends SchemaTableOf<SchemaTable>
>(): SchemaWorld<SchemaTable> {
    return new SchemaWorld<SchemaTable>();
}
