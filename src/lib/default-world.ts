import { ZodFirstPartySchemaTable } from "./zod-first-party-schema-table";

import { Domain } from "./world";
import { KindedAny, NodeFromTable, ZodKindedAny } from "./types";
import { ZodFirstPartyTypeKind } from "zod";
import { SchemaInspector, NodeInspector } from "./schema-inspector";
import { MatchCases, OutTableOf } from "./base-recursion-context";
import { Stack } from "immutable";
import { RecursionContext } from "./default-context";

const w = new Domain<ZodFirstPartySchemaTable>();

export const zodMatch = w.match.bind(w);
export const zodInspect = w.inspect.bind(w);

export const zodTransformer = {
    cases<OutTable extends OutTableOf<ZodFirstPartySchemaTable>>(
        cases: MatchCases<RecursionContext<ZodFirstPartySchemaTable, OutTable>>
    ) {
        return w
            .matcher(rec =>
                RecursionContext<ZodFirstPartySchemaTable, OutTable>({})
            )
            .cases(cases);
    }
};

export type AnyZodInspector = NodeInspector<
    ZodFirstPartySchemaTable,
    KindedAny
>;
export type ZodInspector<Kind extends ZodFirstPartyTypeKind> = SchemaInspector<
    ZodFirstPartySchemaTable,
    Kind
>;
