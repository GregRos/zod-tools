import { zodMatch, zodTransformer } from "@lib";
import { z } from "zod";
import { expectT } from "../helpers/anti-assert";

test("Only ZodString and else", () => {
    const matcher = zodTransformer.cases<{
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
    expect(matcher.recurse(z.string())).toBe("hello");
    expectT(matcher.recurse(z.number())).is<"hello">(false).is<boolean>(true);
    // Takes else branch
    expect(matcher.recurse(z.number())).toBe(false);
    expectT(matcher.recurse(z.number())).is<"hello">(false).is<boolean>(true);
});

test("With case-based recursion", () => {
    const dummy = z.tuple([z.string(), z.tuple([z.number(), z.string()])]);

    const v = zodMatch(dummy).cases<{
        ZodTuple: any[];
        ZodString: "hello";
        ZodNumber: 42;
        else: false;
    }>({
        ZodTuple(node) {
            expectT(node.kind).is<"ZodTuple">(true).is<"ZodString">(false);
            return node._def.items.map(item => this.recurse(item));
        },
        ZodNumber(node) {
            expectT(node.kind).is<"ZodNumber">(true).is<"ZodString">(false);
            return 42;
        },
        ZodString(node) {
            expectT(node.kind).is<"ZodString">(true).is<"ZodNumber">(false);
            return "hello";
        },
        else() {
            return false;
        }
    });

    expect(v).toEqual(["hello", [42, "hello"]]);
});

class NodeMap {
    ZodOptional!: number;
    ZodString!: number;
    else!: number;
}

test("with class output table", () => {
    const dummy = z.string().optional();

    const v = zodMatch(dummy).cases<NodeMap>({
        ZodOptional(node) {
            expectT(node.kind).is<"ZodOptional">(true).is<"ZodString">(false);
            return 1 + this.recurse(node._def.innerType);
        },
        ZodString(node) {
            expectT(node.kind).is<"ZodString">(true).is<"ZodOptional">(false);
            return 1;
        },
        else() {
            return 0;
        }
    });

    expect(v).toBe(2);
});
