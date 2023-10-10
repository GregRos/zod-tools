import { InTableOf } from "./types";
import { Stack } from "immutable";
import {
    BaseContext,
    BaseContextDef,
    OutTableOf,
    Recurse
} from "./base-context";

export class MatcherContext<
    InTable extends InTableOf<InTable>,
    OutTable extends OutTableOf<InTable>
> extends BaseContext<
    InTable,
    OutTable,
    MatcherContext<InTable, OutTable>,
    BaseContextDef<InTable>
> {
    protected _with(D: any): MatcherContext<InTable, OutTable> {
        return new MatcherContext(this._recurse, D);
    }

    static create<
        InTable extends InTableOf<InTable>,
        OutTable extends OutTableOf<InTable>
    >(recurse: Recurse<InTable, OutTable, MatcherContext<InTable, OutTable>>) {
        return new MatcherContext(recurse, {
            path: Stack()
        });
    }
}
