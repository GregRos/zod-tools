import { InTableOf, KindedAny } from "./types";
import { Stack } from "immutable";
import {
    BaseRecursionContext,
    OutTableOf,
    RecursiveTransform
} from "./base-recursion-context";
import { NodeInspector } from "./schema-inspector";
import { undefined } from "zod";

export class RecursionContext<
    InTable extends InTableOf<InTable>,
    OutTable extends OutTableOf<InTable>
> extends BaseRecursionContext<
    InTable,
    OutTable,
    RecursionContext<InTable, OutTable>
> {}
