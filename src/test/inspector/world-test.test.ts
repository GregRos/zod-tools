import { z, ZodNumber, ZodString } from "zod";
import { SchemaWorld } from "@lib";
import {
    SchemaTableWithMagicBox,
    ZodMagicBox,
    ZodMagicBoxDef
} from "../helpers/magic-box";
import { expectT } from "../helpers/anti-assert";

const w = new SchemaWorld<SchemaTableWithMagicBox>();

test("first party ", () => {
    const s = z.string();
    const result = w.inspect(s);
    expectT(result.kind).is<"ZodString">(true).is<"ZodNumber">(false);
    expectT(result._node).is<ZodString>(true).is<ZodNumber>(false);
    expectT(result.kind).is<"ZodString">(true).is<"ZodNumber">(false);
    expect(result.kind).toBe("ZodString");
});

test("new tag", () => {
    const s = new ZodMagicBox({ typeName: "magicBox", value: "hello" });
    const result = w.inspect(s);
    expectT(result.kind).is<"magicBox">(true).is<"ZodNumber">(false);
    expectT(result._node).is<ZodMagicBox>(true).is<ZodNumber>(false);
    expectT(result._def).is<ZodMagicBoxDef>(true).is<ZodNumber>(false);
    if (result.is("magicBox")) {
        expectT(result.kind).is<"magicBox">(true).is<"ZodNumber">(false);
        expect(result.kind).toBe("magicBox");
    } else {
        expectT(result).is<never>(true).si<true>(false);
        fail("error");
    }
});
