import { z, ZodFirstPartyTypeKind, ZodNumber, ZodString } from "zod";
import { zodInspect, ZodInspector } from "@lib";
import { expectT } from "../helpers/anti-assert";

test("is - runtime (1)", () => {
    const inspected = zodInspect(z.string());
    if (inspected.is("ZodNumber")) {
        expectT(inspected).is<never>(true).si<true>(false);
        fail("serror");
    } else if (inspected.is("ZodString")) {
        expectT(inspected)
            .is<ZodInspector<ZodFirstPartyTypeKind.ZodString>>(true)
            .is<ZodInspector<ZodFirstPartyTypeKind.ZodNumber>>(false);

        expectT(inspected.kind)
            .is<ZodFirstPartyTypeKind.ZodString>(true)
            .is<"ZodString">(true)
            .is<ZodFirstPartyTypeKind.ZodNumber>(false);

        expectT(inspected._node).is<ZodString>(true).is<ZodNumber>(false);
    } else {
        expectT(inspected).is<never>(true).si<true>(false);
        fail("error");
    }
});

test("is - runtime (2)", () => {
    const inspected = zodInspect(z.number());
    if (inspected.is("ZodString")) {
        expectT(inspected).is<never>(true).si<true>(false);
        fail("error");
    } else if (inspected.is("ZodNumber")) {
        expectT(inspected)
            .is<ZodInspector<ZodFirstPartyTypeKind.ZodString>>(false)
            .is<ZodInspector<ZodFirstPartyTypeKind.ZodNumber>>(true);

        expectT(inspected.kind)
            .is<ZodFirstPartyTypeKind.ZodString>(false)
            .is<"ZodString">(false)
            .is<ZodFirstPartyTypeKind.ZodNumber>(true)
            .is<"ZodNumber">(true);

        expectT(inspected._node).is<ZodString>(false).is<ZodNumber>(true);
    } else {
        expectT(inspected).is<never>(true).si<true>(false);
        fail("error");
    }
});

test("narrows (1)", () => {
    const inspected = zodInspect(z.string());
    if (inspected.is("ZodString")) {
        expectT(inspected)
            .is<ZodInspector<ZodFirstPartyTypeKind.ZodString>>(true)
            .is<ZodInspector<ZodFirstPartyTypeKind.ZodNumber>>(false);

        expectT(inspected.kind)
            .is<ZodFirstPartyTypeKind.ZodString>(true)
            .is<"ZodString">(true)
            .is<ZodFirstPartyTypeKind.ZodNumber>(false);

        expectT(inspected._node).is<ZodString>(true).is<ZodNumber>(false);
    } else {
        expectT(inspected).is<never>(true);
        fail("should have narrowed");
    }
});
