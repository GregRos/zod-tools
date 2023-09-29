import { zodInspect, ZodInspector } from "@lib";
import { z, ZodFirstPartyTypeKind } from "zod";
import { expectT } from "../helpers/anti-assert";

test("correct kind (1)", () => {
    const inspected = zodInspect(
        z.string()
    ) satisfies ZodInspector<ZodFirstPartyTypeKind.ZodString>;
    expectT(inspected.kind).is<ZodFirstPartyTypeKind.ZodString>(true);
    expectT(inspected.kind).is<"ZodString">(true);
    expectT(inspected.kind).is<ZodFirstPartyTypeKind.ZodNumber>(false);
});

test("correct kind (2)", () => {
    const inspected = zodInspect(
        z.number()
    ) satisfies ZodInspector<ZodFirstPartyTypeKind.ZodNumber>;
    expectT(inspected.kind).is<ZodFirstPartyTypeKind.ZodNumber>(true);
    expectT(inspected.kind).is<"ZodNumber">(true);
    expectT(inspected.kind).is<ZodFirstPartyTypeKind.ZodString>(false);
});
