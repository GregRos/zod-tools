import { SchemaInspector, zodInspect, ZodInspector } from "@lib";
import { z, ZodFirstPartyTypeKind } from "zod";
import { SchemaNodeInspector } from "@lib";

test("works for ZodString", () => {
    const inspected = zodInspect(
        z.string()
    ) satisfies ZodInspector<ZodFirstPartyTypeKind.ZodString>;
    expect(inspected).toBeInstanceOf(SchemaNodeInspector);
});

test("works for ZodNumber", () => {
    const inspected = zodInspect(
        z.number()
    ) satisfies ZodInspector<ZodFirstPartyTypeKind.ZodNumber>;
    expect(inspected).toBeInstanceOf(SchemaNodeInspector);
});
