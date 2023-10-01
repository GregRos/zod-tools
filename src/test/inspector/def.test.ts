import { zodInspect } from "@lib";
import { z, ZodArrayDef, ZodOptionalDef, ZodStringDef } from "zod";
import { expectT } from "../helpers/anti-assert";

test("get def of ZodString", () => {
    const inspected = zodInspect(z.string().describe("asd"));
    expectT(inspected._def).is<ZodStringDef>(true).is<string>(false);
    expect(inspected._def).toMatchObject({
        typeName: "ZodString",
        description: "asd"
    });
});

test("get def of ZodNumber", () => {
    const inspected = zodInspect(z.number().describe("asd"));
    expectT(inspected._def).is<ZodStringDef>(false).is<string>(false);
    expect(inspected._def).toMatchObject({
        typeName: "ZodNumber",
        description: "asd"
    });
});

test("expore def", () => {
    const inspected = zodInspect(z.number().optional().array().optional());
    if (inspected.is("ZodOptional")) {
        expectT(inspected._def)
            .is<ZodStringDef>(false)
            .is<ZodOptionalDef>(true);
    } else {
        expectT(inspected).is<never>(true).si<ZodOptionalDef>(false);
        fail("Expected ZodOptional");
    }
    const inspected2 = zodInspect(inspected._def.innerType);
    if (inspected2.is("ZodArray")) {
        expectT(inspected2._def)
            .is<ZodStringDef>(false)
            .is<ZodOptionalDef>(false)
            .is<ZodArrayDef>(true);
    } else {
        expectT(inspected2).is<never>(true).si<ZodArrayDef>(false);
        fail("Expected ZodArray");
    }

    const inspected3 = zodInspect(inspected2._def.type);
    if (inspected3.is("ZodOptional")) {
        expectT(inspected3._def)
            .is<ZodStringDef>(false)
            .is<ZodOptionalDef>(true)
            .is<ZodArrayDef>(false);
    } else {
        expectT(inspected3).is<never>(true).si<ZodOptionalDef>(false);
        fail("Expected ZodOptional");
    }
});
