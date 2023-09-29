import { SchemaInspector, zodInspect, ZodInspector } from "@lib";
import { z, ZodFirstPartyTypeKind } from "zod";

test("works for ZodString", () => {
    const inspected = zodInspect(
        z.string()
    ) satisfies ZodInspector<ZodFirstPartyTypeKind.ZodString>;
    expect(inspected).toBeInstanceOf(SchemaInspector);
});

test("works for ZodNumber", () => {
    const inspected = zodInspect(
        z.number()
    ) satisfies ZodInspector<ZodFirstPartyTypeKind.ZodNumber>;
    expect(inspected).toBeInstanceOf(SchemaInspector);
});
