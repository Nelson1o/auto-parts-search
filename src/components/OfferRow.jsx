import { memo } from "react";

import { formatPrice, formatCount } from "@/utils/formatPrice.js";
import { formatDate } from "@/utils/formatDate.js";

export const OfferRow = memo(({ row, minPrice }) => {
  const { product, warehouse, isAnalog } = row;

  const price = warehouse?.price;
  const stock = warehouse?.stock ?? 0;
  const shipment = warehouse?.shipmentDate;

  const isMin = price !== undefined && price === minPrice;

  return (
    <tr className={isMin ? "table-success" : undefined}>
      <td className="ps-3 text-break">
        <div className="fw-semibold">
          {product.brand || "Без бренда"}{" "}
          {isAnalog && (
            <span className="badge bg-info text-dark ms-1">аналог</span>
          )}
          {isMin && <span className="badge bg-success ms-1">мин. цена</span>}
        </div>
        <div className="small text-muted">
          {product.name || "—"} · арт. {product.number}
        </div>
      </td>

      <td>
        <div>{warehouse?.code || warehouse?.id || "—"}</div>
        {warehouse?.own && (
          <span className="badge bg-success small">свой склад</span>
        )}
      </td>

      <td className="text-end text-nowrap">
        {price !== undefined ? (
          <span className="fw-semibold">{formatPrice(price)}</span>
        ) : (
          <span className="text-muted">—</span>
        )}
      </td>

      <td className="text-end text-nowrap ps-3">
        {stock > 0 ? (
          <span>{formatCount(stock)} шт.</span>
        ) : (
          <span className="badge bg-secondary">нет в наличии</span>
        )}
      </td>

      <td className="small text-muted text-nowrap ps-3 pe-3">
        {formatDate(shipment)}
      </td>
    </tr>
  );
});
