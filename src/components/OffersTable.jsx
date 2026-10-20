import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Loader } from "./Loader.jsx";
import { ErrorMessage } from "./ErrorMessage.jsx";
import { EmptyState } from "./EmptyState.jsx";
import { OfferRow } from "./OfferRow.jsx";

import {
  fetchAnalogues,
  clearOffers,
  selectOffers,
  selectOffersError,
  selectOffersStatus,
  selectQuery,
  selectSelectedBrand,
} from "@/store/searchSlice.js";
import { flattenOffers } from "@/utils/flattenOffers.js";
import { formatPrice, formatCount } from "@/utils/formatPrice.js";

export const OffersTable = () => {
  const dispatch = useDispatch();
  const query = useSelector(selectQuery);
  const selectedBrand = useSelector(selectSelectedBrand);
  const offers = useSelector(selectOffers);
  const status = useSelector(selectOffersStatus);
  const error = useSelector(selectOffersError);

  const rows = useMemo(() => flattenOffers(offers), [offers]);

  const minPrice = useMemo(() => {
    const prices = rows
      .map((r) => r.warehouse?.price)
      .filter((p) => Number.isFinite(p));
    return prices.length ? Math.min(...prices) : null;
  }, [rows]);

  const totalStock = useMemo(
    () => rows.reduce((acc, r) => acc + (r.warehouse?.stock ?? 0), 0),
    [rows]
  );

  if (!selectedBrand) {
    return (
      <div className="text-center text-muted py-5">
        <p className="mb-0">
          Выберите производителя слева, чтобы увидеть аналоги и предложения
        </p>
      </div>
    );
  }

  if (status === "loading")
    return <Loader text="Ищем аналоги и предложения…" />;

  if (status === "failed") {
    return (
      <ErrorMessage
        message={error}
        onRetry={() =>
          dispatch(
            fetchAnalogues({ number: query.trim(), brand: selectedBrand })
          )
        }
      />
    );
  }

  if (status === "succeeded" && rows.length === 0) {
    return <EmptyState text="Предложения не найдены" />;
  }

  if (status !== "succeeded") return null;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-3 gap-2">
        <div>
          <h2 className="h6 mb-1">Аналоги и предложения</h2>
          <div className="small text-muted">
            Бренд:{" "}
            <span className="fw-semibold text-body">{selectedBrand}</span>
            {" · "}
            Артикул: <span className="fw-semibold text-body">{query}</span>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary text-nowrap"
          onClick={() => dispatch(clearOffers())}
        >
          × Сбросить
        </button>
      </div>

      <div className="table-scroll-wrapper mb-3">
        <table className="table table-hover table-sm align-middle mb-0">
          <thead className="table-light sticky-top">
            <tr>
              <th style={{ width: "32%" }}>Название / Производитель</th>
              <th>Склад</th>
              <th className="text-end">Цена</th>
              <th className="text-end ps-3">Остаток</th>
              <th className="ps-3">Отгрузка</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <OfferRow key={row.key} row={row} minPrice={minPrice} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 small text-muted pt-3 border-top">
        <span>
          Предложений: <strong className="text-body">{rows.length}</strong>
          {" · "}
          Суммарный остаток:{" "}
          <strong className="text-body">{formatCount(totalStock)} шт.</strong>
        </span>
        {minPrice !== null && (
          <span>
            Мин. цена:{" "}
            <strong className="text-success">{formatPrice(minPrice)}</strong>
          </span>
        )}
      </div>
    </div>
  );
};
