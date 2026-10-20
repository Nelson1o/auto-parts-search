const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const countFormatter = new Intl.NumberFormat("ru-RU");

export function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return priceFormatter.format(n);
}

export function formatCount(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  return countFormatter.format(n);
}
