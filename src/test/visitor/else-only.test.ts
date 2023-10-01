import { ZodInspector, zodMatch } from "@lib";
import { z, ZodFirstPartyTypeKind } from "zod";
import { expectT } from "../helpers/anti-assert";

test("must have else", () => {
    // @ts-expect-error Must have else clause
    expect(() => zodMatch().cases({})).toThrow();
});

test("else-only visitor", () => {
    const result = zodMatch(z.string()).cases<{
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
    expectT(result).is<"hello">(true).is<number>(false);
    expect(result).toBe("hello");
});

test("else-only visitor can throw", () => {
    expect(() =>
        zodMatch(z.string()).cases<{
            else: string;
        }>({
            else() {
                throw new Error("hello");
            }
        })
    ).toThrow("hello");
});

test("else-only recursion", () => {
    const dummy = z.string().optional();

    const v = zodMatch(dummy).cases<{
        else: "hello";
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
            throw new Error("Should not happen");
        }
    });

    expect(v).toEqual("hello");
});

test("type error for useless key", () => {
    zodMatch(z.string()).cases<{
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
