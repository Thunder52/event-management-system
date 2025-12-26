import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProfilesApi, addProfileApi } from '../../api/profile.api';

export const fetchProfiles = createAsyncThunk(
  'profile/fetchProfiles',
  async (search, { rejectWithValue }) => {
    try {
      const res = await fetchProfilesApi(search);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profiles');
    }
  }
);

export const addProfile = createAsyncThunk(
  'profile/addProfile',
  async (name, { rejectWithValue }) => {
    try {
      const res = await addProfileApi(name);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add profile');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profiles: [],
    loading: false,
    error: null,
    activeProfileId: null
  },
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
        setActiveProfile: (state, action) => {
      state.activeProfileId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Profile
      .addCase(addProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles.push(action.payload);
      })
      .addCase(addProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileError,setActiveProfile } = profileSlice.actions;
export default profileSlice.reducer;
