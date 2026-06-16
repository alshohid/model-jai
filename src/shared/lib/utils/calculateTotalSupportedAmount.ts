export const calculateTotalSupportedAmount = (
  supportedAmounts: string,
): number => {
  if (!supportedAmounts) return 0;

  return supportedAmounts
    .split(",")
    .map((amount) => parseFloat(amount.trim()) || 0)
    .reduce((total, amount) => total + amount, 0);
};
