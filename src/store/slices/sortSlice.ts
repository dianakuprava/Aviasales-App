import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export type SortOption = 'cheapest' | 'fastest' | 'optimal';

interface SortState {
  value: SortOption;
}

const initialState: SortState = {
  value: 'cheapest',
};

export const sortSlice = createSlice({
  name: 'sort',
  initialState,
  reducers: {
    setSort: (state, action: PayloadAction<SortOption>) => {
      state.value = action.payload;
    },
  },
});

export const { setSort } = sortSlice.actions;
export const selectSort = (state: RootState) => state.sort.value;
export default sortSlice.reducer;
