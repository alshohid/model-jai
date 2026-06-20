export const formatChallengePoints = (value: number | string) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) return `${value}`;

  return `${new Intl.NumberFormat("en-US").format(numericValue)}`;
};

export const formatChallengeCurrency = (value: number | string) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) return `${value} ₱`;

  return `${new Intl.NumberFormat("en-US").format(numericValue)} ₱`;
};
