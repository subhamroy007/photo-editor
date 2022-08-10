import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { FilterResponse } from "../../constants/types";

const filterAdapter = createEntityAdapter<FilterResponse>({
  selectId: (entity) => entity.id,
});

const filterSlice = createSlice({
  name: "filter-slice",
  initialState: filterAdapter.getInitialState(),
  reducers: {
    storeFilter: filterAdapter.upsertOne,
    storeFilters: filterAdapter.upsertMany,
  },
});

export const {
  actions: { storeFilter, storeFilters },
  reducer: filterReducer,
} = filterSlice;

export const { selectById: selectFilterById } = filterAdapter.getSelectors();
