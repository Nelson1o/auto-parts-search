import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setQuery,
  resetResults,
  resetAll,
  fetchBrands,
  selectQuery,
} from "@/store/searchSlice.js";
import { useDebounce } from "@/hooks/useDebounce.js";

export const SearchInput = () => {
  const dispatch = useDispatch();
  const query = useSelector(selectQuery);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) return;

    dispatch(fetchBrands(trimmed));
  }, [debouncedQuery, dispatch]);

  const handleChange = (e) => {
    dispatch(setQuery(e.target.value));
    dispatch(resetResults());
  };

  return (
    <div className="mb-3">
      <label htmlFor="part-number" className="form-label fw-semibold">
        Артикул (номер) автозапчасти
      </label>

      <div className="position-relative">
        <input
          id="part-number"
          type="text"
          className="form-control pe-5"
          placeholder="Например, 01089"
          value={query}
          onChange={handleChange}
          autoComplete="off"
          autoFocus
        />

        {query && (
          <button
            type="button"
            className="btn-close position-absolute top-50 end-0 translate-middle-y me-3"
            aria-label="Очистить"
            onClick={() => dispatch(resetAll())}
          />
        )}
      </div>
    </div>
  );
};
