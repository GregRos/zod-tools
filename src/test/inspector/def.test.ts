import { zodInspect } from "@lib";
import { z, ZodStringDef } from "zod";
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
