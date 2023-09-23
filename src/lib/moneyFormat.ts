export function getMoneyFormat(signDisplay: boolean) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    currencyDisplay: 'narrowSymbol',
    signDisplay: signDisplay ? 'always' : 'auto',
  });
}
