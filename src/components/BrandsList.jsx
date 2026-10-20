import { useDispatch, useSelector } from "react-redux";

import { Loader } from "./Loader.jsx";
import { ErrorMessage } from "./ErrorMessage.jsx";
import { EmptyState } from "./EmptyState.jsx";

import {
  fetchBrands,
  fetchAnalogues,
  selectBrand,
  selectBrands,
  selectBrandsError,
  selectBrandsStatus,
  selectQuery,
  selectSelectedBrand,
} from "@/store/searchSlice.js";
import { formatCount } from "@/utils/formatPrice.js";

export const BrandsList = () => {
  const dispatch = useDispatch();
  const query = useSelector(selectQuery);
  const brands = useSelector(selectBrands);
  const status = useSelector(selectBrandsStatus);
  const error = useSelector(selectBrandsError);
  const selectedBrand = useSelector(selectSelectedBrand);

  if (!query.trim()) return null;

  if (status === "loading") return <Loader text="Ищем производителей…" />;

  if (status === "failed") {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => dispatch(fetchBrands(query.trim()))}
      />
    );
  }

  if (status === "succeeded" && brands.length === 0) {
    return <EmptyState text="По этому артикулу производители не найдены" />;
  }

  if (status !== "succeeded") return null;

  const handleSelect = (brand) => {
    if (brand === selectedBrand) return;
    dispatch(selectBrand(brand));
    dispatch(fetchAnalogues({ number: query.trim(), brand }));
  };

  <h2 className="h6 mb-2">Производители ({brands.length})</h2>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="h6 mb-2">Производители ({brands.length})</h2>
      </div>

      <div className="brands-scroll-wrapper">
        <div className="list-group list-group-flush">
          {brands.map((item, idx) => {
            const isActive = item.brand === selectedBrand;
            return (
              <button
                key={`${item.brand}-${item.number}-${idx}`}
                type="button"
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                  isActive ? "active rounded" : ""
                }`}
                onClick={() => handleSelect(item.brand)}
              >
                <div className="text-start me-2">
                  <div className="fw-semibold">
                    {item.brand || "Без бренда"}
                  </div>
                  <div
                    className={`small ${
                      isActive ? "text-white-50" : "text-muted"
                    }`}
                  >
                    {item.name || "—"} · арт. {item.number}
                  </div>
                </div>
                <span
                  className={`badge ${
                    isActive ? "bg-light text-dark" : "bg-secondary"
                  }`}
                >
                  {formatCount(item.count)} шт.
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
