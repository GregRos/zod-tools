import { SchemaTableOf } from "./types";
import { Stack } from "immutable";
import {
    BaseContext,
    BaseContextDef,
    OutTableOf,
    Recurse
} from "./base-context";

export class MatcherContext<
    SchemaTable extends SchemaTableOf<SchemaTable>,
    OutTable extends OutTableOf<SchemaTable>
> extends BaseContext<
    SchemaTable,
    OutTable,
    MatcherContext<SchemaTable, OutTable>,
    BaseContextDef<SchemaTable>
> {
    protected _with(D: any): MatcherContext<SchemaTable, OutTable> {
        return new MatcherContext(this._recurse, D);
    }

    static create<
        SchemaTable extends SchemaTableOf<SchemaTable>,
        OutTable extends OutTableOf<SchemaTable>
    >(
        recurse: Recurse<
            SchemaTable,
            OutTable,
            MatcherContext<SchemaTable, OutTable>
        >
    ) {
        return new MatcherContext(recurse, {
            path: Stack()
        });
    }
}
