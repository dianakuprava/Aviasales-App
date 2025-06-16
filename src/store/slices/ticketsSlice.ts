import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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
}

const initialState: TicketsState = {
  items: [],
  loading: false,
  error: null,
  displayedCount: 5,
  isAllLoaded: false,
};

export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (_, { rejectWithValue }) => {
    const handleError = (message: string) => rejectWithValue(message);

    try {
      const searchResponse = await fetch('https://aviasales-test-api.kata.academy/search');
      if (!searchResponse.ok) return handleError('Failed to get searchId');

      const { searchId } = await searchResponse.json();
      const ticketsResponse = await fetch(
        `https://aviasales-test-api.kata.academy/tickets?searchId=${searchId}`
      );

      if (!ticketsResponse.ok) return handleError('Failed to fetch tickets');

      return await ticketsResponse.json();
    } catch (error) {
      return handleError(error instanceof Error ? error.message : 'Unknown error');
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;

        const newTickets = action.payload.tickets as Ticket[];
        const existingKeys = new Set(
          state.items.map(t =>
            `${t.price}-${t.carrier}-${t.segments[0].date}-${t.segments[1].date}`
          )
        );

        const uniqueNewTickets = newTickets.filter(ticket => {
          const key = `${ticket.price}-${ticket.carrier}-${ticket.segments[0].date}-${ticket.segments[1].date}`;
          return !existingKeys.has(key);
        });

        state.items = [...state.items, ...uniqueNewTickets];
        state.isAllLoaded = action.payload.stop;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { showMoreTickets, resetError } = ticketsSlice.actions;
export default ticketsSlice.reducer;
