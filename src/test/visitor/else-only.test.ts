import { ZodInspector, zodTransformation } from "@lib";
import { z, ZodFirstPartyTypeKind } from "zod";
import { expectT } from "../helpers/anti-assert";

test("must have else", () => {
    // @ts-expect-error Must have else clause
    expect(() => zodTransformation({})).toThrow();
});

test("else-only visitor", () => {
    const v = zodTransformation<{
        else: "hello";
    }>({
        else(node, ctx) {
            expect(ctx.parents).toEqual([]);
            expectT(node)
                .is<ZodInspector<string>>(true)
                // Weird but expected
                .is<ZodInspector<ZodFirstPartyTypeKind.ZodString>>(false);
            return "hello";
        }
    });
    const result = v.run(z.string());
    expectT(result).is<"hello">(true).is<number>(false);
    expect(v.run(z.string())).toBe("hello");
    expect(v.run(z.number())).toBe("hello");
});

test("else-only visitor can throw", () => {
    const v = zodTransformation<{
        else: string;
    }>({
        else() {
            throw new Error("hello");
        }
    });
    expect(() => v.run(z.string())).toThrow("hello");
});

test("else-only recursion", () => {
    const dummy = z.string().optional();

    const v = zodTransformation<{
        else: any;
    }>({
        else(node, ctx) {
            if (node.is("ZodOptional")) {
                expect(ctx.parents).toEqual([]);
                expectT(node.kind)
                    .is<"ZodOptional">(true)
                    .is<"ZodString">(false);

                return ctx.recurse(node._def.innerType);
            }
            if (node.is("ZodString")) {
                expect(ctx.parents.map(x => x._node)).toEqual([dummy]);
                expectT(node.kind)
                    .is<"ZodString">(true)
                    .is<"ZodOptional">(false);
                return "hello";
            }
        }
    });

    expect(v.run(dummy)).toEqual("hello");
});

test("type error for useless key", () => {
    zodTransformation<{
        else: any;
    }>({
        else() {
            return "hello";
        },
        // @ts-expect-error Not a valid key
        foo() {
            return "world";
        }
    });
});
