import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface FiltersState {
  all: boolean;
  noTransfers: boolean;
  oneTransfer: boolean;
  twoTransfers: boolean;
  threeTransfers: boolean;
}

const initialState: FiltersState = {
  all: true,
  noTransfers: true,
  oneTransfer: true,
  twoTransfers: true,
  threeTransfers: true,
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    toggleFilter: (state, action: PayloadAction<keyof FiltersState>) => {
      const filter = action.payload;

      if (filter === 'all') {
        const newValue = !state.all;
        return {
          ...state,
          all: newValue,
          noTransfers: newValue,
          oneTransfer: newValue,
          twoTransfers: newValue,
          threeTransfers: newValue,
        };
      } else {
        const newState = {
          ...state,
          [filter]: !state[filter],
          all: false,
        };

        newState.all =
          newState.noTransfers &&
          newState.oneTransfer &&
          newState.twoTransfers &&
          newState.threeTransfers;

        return newState;
      }
    },
  },
});

export const { toggleFilter } = filtersSlice.actions;
export const selectFilters = (state: RootState) => state.filters;
export default filtersSlice.reducer;
