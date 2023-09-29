import { zodTransformation } from "@lib";
import { z } from "zod";
import { expectT } from "../helpers/anti-assert";

test("Only ZodString and else", () => {
    const v = zodTransformation<{
        ZodString: "hello";
        else: false;
    }>({
        ZodString(node) {
            return "hello";
        },
        else() {
            return false;
        }
    });
    expect(v.run(z.string()) satisfies "hello").toBe("hello");
    // Takes else branch
    expect(v.run(z.number()) satisfies "hello" | false).toBe(false);
});

test("With case-based recursion", () => {
    const v = zodTransformation<{
        ZodTuple: any[];
        ZodString: "hello";
        ZodNumber: 42;
        else: false;
    }>({
        ZodTuple(node, ctx) {
            expectT(node.kind).is<"ZodTuple">(true).is<"ZodString">(false);
            return node._def.items.map(item => ctx.recurse(item));
        },
        ZodNumber(node, ctx) {
            expectT(node.kind).is<"ZodNumber">(true).is<"ZodString">(false);
            return 42;
        },
        ZodString(node, ctx) {
            expectT(node.kind).is<"ZodString">(true).is<"ZodNumber">(false);
            return "hello";
        },
        else() {
            return false;
        }
    });

    const dummy = z.tuple([z.string(), z.tuple([z.number(), z.string()])]);

    const result = v.run(dummy);
    expect(result).toEqual(["hello", [42, "hello"]]);
});
