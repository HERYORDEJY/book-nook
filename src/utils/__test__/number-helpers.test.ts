import { splitNumber } from "~/utils/number-helpers";

describe("splitNumber", () => {
    it("splits a fractional number into whole and decimal parts", () => {
        expect(splitNumber(4.5)).toEqual({ whole: 4, decimal: 0.5 });
    });

    it("returns a zero decimal for whole numbers", () => {
        expect(splitNumber(3)).toEqual({ whole: 3, decimal: 0 });
    });
});
