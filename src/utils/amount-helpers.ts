export function formatAmountIntl(
    amount: number,
    currency: string = "NGN",
    locale: string = "en-NG",
): string {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return "₦0.00";
    }

    const amountNumber =
        typeof amount === "string" ? parseFloat(amount) : amount;

    if (isNaN(amountNumber)) {
        return "₦0.00";
    }

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: "symbol",
    }).format(amountNumber);
}
