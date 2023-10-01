import { ZodFirstPartySchemaTable } from "./zod-first-party-schema-table";

import { SchemaWorld } from "./world";
import { NodeFromTable, ZodKindedAny } from "./types";
import { ZodFirstPartyTypeKind } from "zod";
import { SchemaInspector, SchemaNodeInspector } from "./schema-inspector";

const w = new SchemaWorld<ZodFirstPartySchemaTable>();

export const zodMatch = w.match.bind(w);
export const zodInspect = w.inspect.bind(w);
export const zodMatcher = w.matcher.bind(w);

export type ZodInspector<Kind extends keyof ZodFirstPartySchemaTable & string> =
    SchemaInspector<ZodFirstPartySchemaTable, Kind>;
