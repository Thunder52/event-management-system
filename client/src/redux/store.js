import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileReducer';
import eventReducer from './slices/eventSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    event: eventReducer,
  },
});