import { KindedAny, InTableOf, ZodKindedAny, ZodKindOf } from "./types";
import { SchemaInspector, NodeInspector } from "./schema-inspector";
import {
    getOutputTypeOrDefault,
    MatchCases,
    BaseRecursionContext,
    OutTableOf,
    RecursiveTransform
} from "./base-recursion-context";
import { Stack } from "immutable";
import { RecursionContext } from "./default-context";

/**
 * Use this if you have custom schema nodes. You need to explicitly specify the
 * `SchemaTable` so the world knows which schemas are included. Then you can create
 * matchers and inspectors that work with your custom schemas.
 */
export class Domain<InTable extends InTableOf<InTable>> {
    /**
     * Create a schema inspector for a given schema node.
     * @param node The schema node to inspect.
     */
    inspect<Z extends KindedAny>(node: Z): NodeInspector<InTable, Z> {
        return new NodeInspector(node as any);
    }

    matcher<Ctx extends BaseRecursionContext<InTable, any, any>>(
        contextCtor: (recurse: RecursiveTransform<InTable, any, Ctx>) => Ctx
    ) {
        return {
            cases(cases: MatchCases<Ctx>): Ctx {
                const recurse: RecursiveTransform<
                    InTable,
                    Ctx["__OutTable__"],
                    Ctx
                > = function (this: Ctx, node) {
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
        };
    }

    match<MatchTarget extends KindedAny>(target: MatchTarget) {
        const world = this;
        return {
            cases<OutTable extends OutTableOf<InTable>>(
                cases: MatchCases<RecursionContext<InTable, OutTable>>
            ) {
                return world
                    .matcher(RecursionContext<InTable, OutTable>)
                    .cases(cases)
                    .recurse(target);
            }
        };
    }
}

export function world<InTable extends InTableOf<InTable>>(): Domain<InTable> {
    return new Domain<InTable>();
}
