export const formatChallengePoints = (value: number | string) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) return `${value}pt`;

  return `${new Intl.NumberFormat("en-US").format(numericValue)}pt`;
};

export const formatChallengeCurrency = (value: number | string) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) return `${value} ₱`;

  return `${new Intl.NumberFormat("en-US").format(numericValue)} ₱`;
};
