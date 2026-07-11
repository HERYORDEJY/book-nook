export function splitNumber(num: number): { whole: number; decimal: number } {
    const whole = Math.floor(num);
    const decimal = parseFloat((num - whole).toFixed(10));
    return { whole, decimal };
}
