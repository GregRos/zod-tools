import { zodMatch, zodMatcher } from "@lib";
import { z } from "zod";
import { expectT } from "../helpers/anti-assert";

test("Only ZodString and else", () => {
    const matcher = zodMatcher().cases<{
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
    expect(matcher).toBeInstanceOf(Function);
    expect(matcher(z.string())).toBe("hello");
    expectT(matcher(z.number())).is<"hello">(false).is<boolean>(true);
    // Takes else branch
    expect(matcher(z.number())).toBe(false);
    expectT(matcher(z.number())).is<"hello">(false).is<boolean>(true);
});

test("With case-based recursion", () => {
    const dummy = z.tuple([z.string(), z.tuple([z.number(), z.string()])]);

    const v = zodMatch(dummy).cases<{
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

    expect(v).toEqual(["hello", [42, "hello"]]);
});
