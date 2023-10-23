import { SchemaTableWithMagicBox } from "../helpers/magic-box";
import { Domain, world } from "@lib";
import { z, ZodFirstPartyTypeKind, ZodOptionalDef, ZodStringDef } from "zod";
import { expectT } from "../helpers/anti-assert";

const w = world<SchemaTableWithMagicBox>();

test("first party - else ", () => {
    const s = z.string().optional();
    const result = w.match(s).cases<{
        else: number;
    }>({
        else(node) {
            if (node.is(ZodFirstPartyTypeKind.ZodOptional)) {
                expectT(node._def)
                    .is<ZodOptionalDef>(true)
                    .is<ZodStringDef>(false);
                return 1 + this.recurse(node._def.innerType);
            } else if (node.is(ZodFirstPartyTypeKind.ZodString)) {
                expectT(node._def)
                    .is<ZodOptionalDef>(false)
                    .is<ZodStringDef>(true);
                return 1;
            }
            return 1;
        }
    });
    expect(result).toBe(2);
    expectT(result).is<number>(true).is<string>(false);
});

test("test - first party, cases", () => {
    const s = z.string().optional();
    const result = w.match(s).cases<{
        ZodOptional: number;
        ZodString: number;
        else: number;
    }>({
        ZodString(node) {
            expectT(node._def).is<ZodOptionalDef>(false).is<ZodStringDef>(true);
            return 1;
        },
        ZodOptional(node) {
            expectT(node._def).is<ZodOptionalDef>(true).is<ZodStringDef>(false);
            return 1 + this.recurse(node._def.innerType);
        },
        else() {
            fail("should not else");
        }
    });
    expect(result).toBe(2);
    expectT(result).is<number>(true).is<string>(false);
});
