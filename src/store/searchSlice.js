import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchByNumber, searchAnalogues } from "../api/favoritApi.js";

export const fetchBrands = createAsyncThunk(
  "search/fetchBrands",
  async (number, { rejectWithValue }) => {
    try {
      return await searchByNumber(number);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAnalogues = createAsyncThunk(
  "search/fetchAnalogues",
  async ({ number, brand }, { rejectWithValue }) => {
    try {
      return await searchAnalogues(number, brand);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  query: "",

  brands: [],
  brandsStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  brandsError: null,

  selectedBrand: null,
  offers: [],
  offersStatus: "idle",
  offersError: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
    },

    selectBrand(state, action) {
      state.selectedBrand = action.payload;
    },

    resetResults(state) {
      state.brands = [];
      state.brandsStatus = "idle";
      state.brandsError = null;
      state.selectedBrand = null;
      state.offers = [];
      state.offersStatus = "idle";
      state.offersError = null;
    },

    clearOffers(state) {
      state.selectedBrand = null;
      state.offers = [];
      state.offersStatus = "idle";
      state.offersError = null;
    },

    resetAll() {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.brandsStatus = "loading";
        state.brandsError = null;
        state.brands = [];

        state.selectedBrand = null;
        state.offers = [];
        state.offersStatus = "idle";
        state.offersError = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        if (action.meta.arg !== state.query.trim()) return;

        state.brandsStatus = "succeeded";
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        if (action.meta.arg !== state.query.trim()) return;

        state.brandsStatus = "failed";
        state.brandsError = action.payload ?? action.error.message;
      })

      .addCase(fetchAnalogues.pending, (state) => {
        state.offersStatus = "loading";
        state.offersError = null;
        state.offers = [];
      })
      .addCase(fetchAnalogues.fulfilled, (state, action) => {
        if (action.meta.arg.number !== state.query.trim()) return;
        if (action.meta.arg.brand !== state.selectedBrand) return;

        state.offersStatus = "succeeded";
        state.offers = action.payload;
      })
      .addCase(fetchAnalogues.rejected, (state, action) => {
        if (action.meta.arg.number !== state.query.trim()) return;
        if (action.meta.arg.brand !== state.selectedBrand) return;

        state.offersStatus = "failed";
        state.offersError = action.payload ?? action.error.message;
      });
  },
});

export const { clearOffers, resetAll, resetResults, selectBrand, setQuery } =
  searchSlice.actions;

export const searchReducer = searchSlice.reducer;

export const selectQuery = (state) => state.search.query;
export const selectBrands = (state) => state.search.brands;
export const selectBrandsStatus = (state) => state.search.brandsStatus;
export const selectBrandsError = (state) => state.search.brandsError;
export const selectSelectedBrand = (state) => state.search.selectedBrand;
export const selectOffers = (state) => state.search.offers;
export const selectOffersStatus = (state) => state.search.offersStatus;
export const selectOffersError = (state) => state.search.offersError;
