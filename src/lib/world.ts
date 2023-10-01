import { SchemaTableOf, ZodKindedAny, ZodKindOf } from "./types";
import { SchemaInspector, SchemaNodeInspector } from "./schema-inspector";
import {
    getOutputTypeOrDefault,
    MatcherCases,
    MatcherCore,
    OutTableOf
} from "./matcher-core";

/**
 * Used in the recursive matcher. Specify the `OutTable` and the match cases,
 * then immediately apply the matcher.
 */
export interface MatchingCases<
    SchemaTable extends SchemaTableOf,
    MatchTarget extends ZodKindedAny,
    ExtraCtx extends object
> {
    cases<OutTable extends OutTableOf<SchemaTableOf>>(
        cases: MatcherCases<SchemaTable, OutTable, ExtraCtx>
    ): getOutputTypeOrDefault<MatchTarget, OutTable>;
}

/**
 * Used by the recursive matcher. Specify the `OutTable` and the match cases,
 * getting a reusable matching function in return.
 */
export interface BuildingMatcher<
    SchemaTable extends SchemaTableOf,
    ExtraCtx extends object
> {
    cases<OutTable extends OutTableOf<SchemaTableOf>>(
        cases: MatcherCases<SchemaTable, OutTable, ExtraCtx>
    ): <MatchTarget extends ZodKindedAny>(
        target: MatchTarget
    ) => getOutputTypeOrDefault<MatchTarget, OutTable>;
}

/**
 * Use this if you have custom schema nodes. You need to explicitly specify the
 * `SchemaTable` so the world knows which schemas are included. Then you can create
 * matchers and inspectors that work with your custom schemas.
 */
export class SchemaWorld<SchemaTable extends SchemaTableOf> {
    /**
     * Create a schema inspector for a given schema node.
     * @param node The schema node to inspect.
     */
    inspect<Z extends ZodKindedAny>(
        node: Z
    ): SchemaNodeInspector<SchemaTable, Z> {
        return new SchemaNodeInspector(node as any);
    }

    /**
     * Start building a reusable matcher with a basic context.
     */
    matcher(): BuildingMatcher<SchemaTable, object>;
    /**
     * Start building a reusable matcher with custom ExtraCtx.
     * @param ctx A context object mixed into the
     */
    matcher<ExtraCtx extends object>(
        ctx: ExtraCtx
    ): BuildingMatcher<SchemaTable, ExtraCtx>;
    matcher(ctx?: any): any {
        return {
            cases<OutTable extends OutTableOf<SchemaTable>>(
                cases: MatcherCases<SchemaTable, OutTable, any>
            ) {
                const matcher = new MatcherCore<SchemaTable, OutTable, any>(
                    cases,
                    ctx ?? ({} as any)
                );
                return (target: any) => matcher.run(target);
            }
        };
    }

    match<MatchTarget extends ZodKindedAny>(
        target: MatchTarget
    ): MatchingCases<SchemaTable, MatchTarget, object>;
    match<MatchTarget extends ZodKindedAny, ExtraCtx extends object>(
        target: MatchTarget,
        ctx: ExtraCtx
    ): MatchingCases<SchemaTable, MatchTarget, ExtraCtx>;
    match(target: any, ctx?: any) {
        const matcher = this.matcher(ctx ?? {});
        return {
            cases<OutTable extends OutTableOf<SchemaTable>>(
                cases: MatcherCases<SchemaTable, OutTable, any>
            ) {
                return matcher.cases(cases)(target);
            }
        };
    }
}

export function world<
    SchemaTable extends SchemaTableOf
>(): SchemaWorld<SchemaTable> {
    return new SchemaWorld<SchemaTable>();
}
