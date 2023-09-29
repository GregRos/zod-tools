import { SchemaTableOf, ZodKindedAny, ZodKindOf } from "./types";
import { SchemaInspector } from "./schema-inspector";
import {
    OutTableOf,
    TransformationCases,
    TransformationCore
} from "./transformation-core";

export class SchemaWorld<SchemaTable extends SchemaTableOf> {
    inspect<Z extends ZodKindedAny>(
        node: Z
    ): SchemaInspector<SchemaTable, ZodKindOf<Z>>;
    inspect(node: any): any {
        return new SchemaInspector(node as any);
    }

    transformation<OutTable extends OutTableOf<SchemaTable>>(
        cases: TransformationCases<SchemaTable, OutTable>
    ) {
        if (!cases.else) {
            throw new Error("Visitor must have an 'else' case.");
        }
        return new TransformationCore(cases);
    }
}

export function world<
    SchemaTable extends SchemaTableOf
>(): SchemaWorld<SchemaTable> {
    return new SchemaWorld<SchemaTable>();
}
