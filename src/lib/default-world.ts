import { ZodFirstPartySchemaTable } from "./zod-first-party-schema-table";

import { SchemaWorld } from "./world";
import { NodeFromTable, ZodKindedAny } from "./types";
import { ZodFirstPartyTypeKind } from "zod";
import { SchemaInspector, SchemaNodeInspector } from "./schema-inspector";
import { MatcherCases, OutTableOf } from "./base-context";
import { Stack } from "immutable";
import { MatcherContext } from "./default-context";

const w = new SchemaWorld<ZodFirstPartySchemaTable>();

export const zodMatch = w.match.bind(w);
export const zodInspect = w.inspect.bind(w);

export const zodMatcher = {
    cases<OutTable extends OutTableOf<ZodFirstPartySchemaTable>>(
        cases: MatcherCases<MatcherContext<ZodFirstPartySchemaTable, OutTable>>
    ) {
        return w
            .matcher(MatcherContext.create<ZodFirstPartySchemaTable, OutTable>)
            .cases(cases);
    }
};

export type AnyZodInspector = SchemaNodeInspector<
    ZodFirstPartySchemaTable,
    ZodKindedAny
>;
export type ZodInspector<Kind extends keyof ZodFirstPartySchemaTable> =
    SchemaInspector<ZodFirstPartySchemaTable, Kind>;
