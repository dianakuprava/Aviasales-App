import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TicketSegment {
  origin: string;
  destination: string;
  date: string;
  stops: string[];
  duration: number;
}

interface Ticket {
  price: number;
  carrier: string;
  segments: TicketSegment[];
}

interface TicketsState {
  items: Ticket[];
  loading: boolean;
  error: string | null;
  displayedCount: number;
  isAllLoaded: boolean;
  chunksLoaded: number;
  totalChunks: number;
}

const initialState: TicketsState = {
  items: [],
  loading: false,
  error: null,
  displayedCount: 5,
  isAllLoaded: false,
  chunksLoaded: 0,
  totalChunks: 0,
};

export const fetchTickets = createAsyncThunk<void, void, { state: { tickets: TicketsState } }>(
  'tickets/fetchTickets',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const searchRes = await fetch('https://aviasales-test-api.kata.academy/search');
      if (!searchRes.ok) throw new Error('Не удалось получить searchId');
      const { searchId } = await searchRes.json();

      let stop = false;
      let errorCount = 0;

      while (!stop && errorCount < 3) {
        try {
          const res = await fetch(
            `https://aviasales-test-api.kata.academy/tickets?searchId=${searchId}`
          );
          if (!res.ok) throw new Error('Ошибка сервера при получении билетов');

          const data = await res.json();
          dispatch(addTickets(data.tickets));
          dispatch(incrementChunks());

          const state = getState();
          const chunksLoaded = state.tickets.chunksLoaded;

          if (!data.stop) {
            dispatch(setTotalChunks(chunksLoaded + 1));
          } else {
            dispatch(setTotalChunks(chunksLoaded));
          }

          stop = data.stop;
        } catch (err) {
          errorCount += 1;
        }
      }

      if (errorCount >= 3) {
        dispatch(setPartialLoad(true));
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Неизвестная ошибка');
    }
  }
);

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    showMoreTickets: (state) => {
      state.displayedCount += 5;
    },
    resetError: (state) => {
      state.error = null;
    },
    addTickets: (state, action: PayloadAction<Ticket[]>) => {
      const existingKeys = new Set(
        state.items.map(
          (t) => `${t.price}-${t.carrier}-${t.segments[0].date}-${t.segments[1].date}`
        )
      );

      const uniqueNewTickets = action.payload.filter((ticket) => {
        const key = `${ticket.price}-${ticket.carrier}-${ticket.segments[0].date}-${ticket.segments[1].date}`;
        return !existingKeys.has(key);
      });

      state.items.push(...uniqueNewTickets);
    },
    incrementChunks: (state) => {
      state.chunksLoaded += 1;
    },
    setPartialLoad: (state, action: PayloadAction<boolean>) => {
      state.isAllLoaded = action.payload;
      if (action.payload) {
        state.error = 'Не все билеты были загружены. Попробуйте обновить позже.';
      }
    },
    setTotalChunks: (state, action: PayloadAction<number>) => {
      state.totalChunks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
        state.isAllLoaded = false;
        state.chunksLoaded = 0;
        state.totalChunks = 0;
      })
      .addCase(fetchTickets.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.isAllLoaded = true;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  showMoreTickets,
  resetError,
  addTickets,
  incrementChunks,
  setPartialLoad,
  setTotalChunks,
} = ticketsSlice.actions;

export default ticketsSlice.reducer;
