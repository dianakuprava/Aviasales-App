import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './slices/filtersSlice';
import ticketsReducer from './slices/ticketsSlice';
import sortReducer from './slices/sortSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    tickets: ticketsReducer,
    sort: sortReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
