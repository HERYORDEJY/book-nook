import { formatAmountIntl } from "~/utils/amount-helpers";

describe("formatAmountIntl", () => {
    it("formats a whole amount with the naira symbol, grouping and two decimals", () => {
        const result = formatAmountIntl(2500);
        expect(result).toContain("₦");
        expect(result).toContain("2,500.00");
    });

    it("always renders exactly two decimal places", () => {
        expect(formatAmountIntl(1234.5)).toContain("1,234.50");
        expect(formatAmountIntl(10)).toContain("10.00");
    });

    it("formats zero as ₦0.00", () => {
        expect(formatAmountIntl(0)).toBe("₦0.00");
    });

    it("falls back to ₦0.00 for NaN", () => {
        expect(formatAmountIntl(NaN)).toBe("₦0.00");
    });

    it("falls back to ₦0.00 for null/undefined amounts", () => {
        expect(formatAmountIntl(undefined as unknown as number)).toBe("₦0.00");
        expect(formatAmountIntl(null as unknown as number)).toBe("₦0.00");
    });
});
