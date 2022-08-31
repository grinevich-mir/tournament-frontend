export default (amount, currency = 'USD', alwaysShowFractions) => {
  let minimumFractionDigits = Number.isInteger(amount) ? 0 : undefined;

  if (alwaysShowFractions) {
    minimumFractionDigits = undefined;
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currencyDisplay: 'symbol',
    currency,
    minimumFractionDigits,
  });
  return formatter.format(amount);
};
