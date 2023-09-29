import { expectT } from "./helpers/anti-assert";

test("expectT assertions work", () => {
    expectT(1 as 1)
        .is<1>(true)
        .is<2>(false);
    // @ts-expect-error should fail
    expectT(1 as 1).is<2>(true);
});
