import { KindedAny, InTableOf, ZodKindedAny, ZodKindOf } from "./types";
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
 * Use this if you have custom schema nodes. You need to explicitly specify the
 * `SchemaTable` so the world knows which schemas are included. Then you can create
 * matchers and inspectors that work with your custom schemas.
 */
export class SchemaWorld<InTable extends InTableOf<InTable>> {
    /**
     * Create a schema inspector for a given schema node.
     * @param node The schema node to inspect.
     */
    inspect<Z extends KindedAny>(node: Z): SchemaNodeInspector<InTable, Z> {
        return new SchemaNodeInspector(node as any);
    }

    matcher<Ctx extends BaseContext<InTable, any, any>>(
        createEmpty: (recurse: Recurse<InTable, any, any>) => Ctx
    ) {
        return {
            cases(cases: MatcherCases<Ctx>): Ctx {
                const recurse: Recurse<InTable, Ctx["__OutTable__"], Ctx> =
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

    match<MatchTarget extends KindedAny>(target: MatchTarget) {
        const world = this;
        return {
            cases<OutTable extends OutTableOf<InTable>>(
                cases: MatcherCases<MatcherContext<InTable, OutTable>>
            ) {
                return world
                    .matcher(
                        recurse =>
                            new MatcherContext<InTable, OutTable>(recurse, {
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
    InTable extends InTableOf<InTable>
>(): SchemaWorld<InTable> {
    return new SchemaWorld<InTable>();
}
