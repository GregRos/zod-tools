import { ZodFirstPartySchemaTable } from "./zod-first-party-schema-table";
import {
    OutTableOf,
    TransformationCases,
    TransformationCore
} from "./transformation-core";
import { SchemaInspector } from "./schema-inspector";
import { ZodFirstPartyTypeKind } from "zod";
import { ZodKindedAny, ZodKindOf } from "./types";

export type ZodTransformationCases<
    OutTable extends OutTableOf<ZodFirstPartySchemaTable>
> = TransformationCases<ZodFirstPartySchemaTable, OutTable>;

export type ZodTransformation<
    OutTable extends OutTableOf<ZodFirstPartySchemaTable>
> = TransformationCore<ZodFirstPartySchemaTable, OutTable>;

export type ZodInspector<
    Key extends ZodFirstPartyTypeKind[keyof ZodFirstPartyTypeKind] & string
> = SchemaInspector<ZodFirstPartySchemaTable, Key>;

export function zodTransformation<
    Cases extends OutTableOf<ZodFirstPartySchemaTable> & {
        else: unknown;
    }
>(cases: ZodTransformationCases<Cases>) {
    return new TransformationCore<ZodFirstPartySchemaTable, Cases>(cases);
}

export function zodInspect<Z extends ZodKindedAny<ZodFirstPartyTypeKind>>(
    node: Z
): ZodInspector<ZodKindOf<Z>> {
    return new SchemaInspector(node as any);
}
