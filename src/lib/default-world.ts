import { ZodFirstPartyNodesTable } from "./zod-first-party-nodes-table";

import { SchemaWorld } from "./world";
import { KindedAny, NodeFromTable, ZodKindedAny } from "./types";
import { ZodFirstPartyTypeKind } from "zod";
import { SchemaInspector, SchemaNodeInspector } from "./schema-inspector";
import { MatcherCases, OutTableOf } from "./base-context";
import { Stack } from "immutable";
import { MatcherContext } from "./default-context";

const w = new SchemaWorld<ZodFirstPartyNodesTable>();

export const zodMatch = w.match.bind(w);
export const zodInspect = w.inspect.bind(w);

export const zodMatcher = {
    cases<OutTable extends OutTableOf<ZodFirstPartyNodesTable>>(
        cases: MatcherCases<MatcherContext<ZodFirstPartyNodesTable, OutTable>>
    ) {
        return w
            .matcher(MatcherContext.create<ZodFirstPartyNodesTable, OutTable>)
            .cases(cases);
    }
};

export type AnyZodInspector = SchemaNodeInspector<
    ZodFirstPartyNodesTable,
    KindedAny
>;
export type ZodInspector<Kind extends keyof ZodFirstPartyNodesTable> =
    SchemaInspector<ZodFirstPartyNodesTable, Kind>;
