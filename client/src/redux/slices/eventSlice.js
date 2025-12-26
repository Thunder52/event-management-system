import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../api/profile.api';

/* Fetch events */
export const fetchEvents = createAsyncThunk(
  'event/fetch',
  async (profileId) => {
    const res = await API.get(`/event/${profileId}`);
    return res.data.data;
  }
);

/* Create event */
export const createEvent = createAsyncThunk(
  'event/create',
  async (payload) => {
    const res = await API.post('/event', payload);
    return res.data.data;
  }
);

/* Update event */
export const updateEvent = createAsyncThunk(
  'event/update',
  async (payload) => {
    const { id, ...data } = payload;
    const res = await API.put(`/event/${id}`, data);
    return res.data.data;
  }
);

/* Fetch event logs */
export const fetchEventLogs = createAsyncThunk(
  'event/fetchLogs',
  async (eventId) => {
    const res = await API.get(`/event/logs/${eventId}`);
    return res.data.data;
  }
);

const eventSlice = createSlice({
  name: 'event',
  initialState: {
    events: [],
    logs: [],
    loading: false,
    logsLoading: false,
  },
  reducers: {
    clearLogs: (state) => {
      state.logs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEvent.fulfilled, (state) => {
        state.loading = false;
        // Events will be refreshed by fetchEvents after creation
      })
      .addCase(createEvent.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEvent.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateEvent.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchEventLogs.pending, (state) => {
        state.logsLoading = true;
      })
      .addCase(fetchEventLogs.fulfilled, (state, action) => {
        state.logsLoading = false;
        state.logs = action.payload;
      })
      .addCase(fetchEventLogs.rejected, (state) => {
        state.logsLoading = false;
      });
  },
});

export const { clearLogs } = eventSlice.actions;
export default eventSlice.reducer;
