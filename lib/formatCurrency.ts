export function formatCurrency(amount: number, currency: string = "USD"): string {
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.toUpperCase(), // ✅ Use 'currency' instead of 'currencyCode'
        }).format(amount);
    } catch (error) {
        console.error("Invalid Currency Code:", currency, error);
        return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
    }
}
