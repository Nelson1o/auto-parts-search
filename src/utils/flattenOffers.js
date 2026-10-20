export function flattenOffers(offers) {
  const rows = [];

  offers.forEach((rootProduct, rootIdx) => {
    pushProductRows(rows, rootProduct, false, `root-${rootIdx}`);

    const analogues = Array.isArray(rootProduct.analogues)
      ? rootProduct.analogues
      : [];

    analogues.forEach((analog, analogIdx) => {
      pushProductRows(
        rows,
        analog,
        true,
        `root-${rootIdx}-analog-${analogIdx}`
      );
    });
  });

  return rows;
}

function pushProductRows(rows, product, isAnalog, baseKey) {
  const warehouses = Array.isArray(product.warehouses)
    ? product.warehouses
    : [];

  if (warehouses.length === 0) {
    rows.push({ key: `${baseKey}-none`, product, warehouse: null, isAnalog });
    return;
  }

  warehouses.forEach((wh, idx) => {
    rows.push({
      key: `${baseKey}-wh-${wh.id ?? idx}`,
      product,
      warehouse: wh,
      isAnalog,
    });
  });
}
