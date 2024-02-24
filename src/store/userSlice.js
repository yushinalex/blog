import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { fetchSome } from '../services/fetchSome';

const baseUrl = 'https://blog.kata.academy/api/';

export const fetchRegister = createAsyncThunk('user/fetchRegister', async (userData, { rejectWithValue }) => {
  const url = `${baseUrl}users`;

  const { username, email, password } = userData;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        username,
        email,
        password,
      },
    }),
  };

  return fetchSome(url, rejectWithValue, options);
});

export const fetchProfile = createAsyncThunk('user/fetchProfile', async (data, { rejectWithValue }) => {
  const url = `${baseUrl}user`;

  const { token, userData } = data;

  const { username, email, password, image } = userData;

  const body = password ? { user: { username, email, password, image } } : { user: { username, email, image } };

  const options = {
    method: 'PUT',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  return fetchSome(url, rejectWithValue, options);
});

export const fetchLogin = createAsyncThunk('user/fetchLogin', async (userData, { rejectWithValue }) => {
  const url = `${baseUrl}users/login`;

  const { address, password } = userData;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        email: address,
        password,
      },
    }),
  };

  return fetchSome(url, rejectWithValue, options);
});

export const fetchGetUser = createAsyncThunk('user/fetchGetUser', async (token, { rejectWithValue }) => {
  const url = `${baseUrl}user`;

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
    },
  };

  return fetchSome(url, rejectWithValue, options);
});

const initial = {
  isLogged: null,
  user: {
    email: null,
    token: null,
    username: null,
    bio: null,
    image: null,
  },
  status: null,
  error: null, // error message
  response: { errors: { username: null, email: null, 'email or password': null } },
};

const userSlice = createSlice({
  name: 'user',
  initialState: initial,
  reducers: {
    logOut(state) {
      localStorage.removeItem('token');
      state = { ...initial, isLogged: false };
      return state;
    },
    logIn(state, action) {
      state.isLogged = action.payload;
    },
    onInputChange(state, action) {
      if (action.payload === 'address' || action.payload === 'password') {
        if (state.response.errors['email or password'] !== null) {
          state.response.errors['email or password'] = null;
        }
      }

      if (state.response[action.payload] !== null) {
        state.response.errors[action.payload] = null;
      }
    },
    onPageChange(state) {
      state.status = null;
      state.error = null;
      state.response = { errors: { username: null, email: null, 'email or password': null } };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegister.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.response = { errors: { username: null, email: null } };
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.status = 'completed';
        state.user = action.payload.user;
        state.isLogged = true;
        localStorage.setItem('token', action.payload.user.token);
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.status = 'failed';
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        }
        if (typeof action.payload === 'object') {
          state.response = action.payload;
        }
      })
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.response = { errors: { username: null, email: null, 'email or password': null } };
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'completed';
        state.user = { ...state.user, ...action.payload.user };
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        }
        if (typeof action.payload === 'object') {
          state.response = action.payload;
        }
      })
      .addCase(fetchLogin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.response = { errors: { username: null, email: null, 'email or password': null } };
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.status = 'completed';
        state.user = action.payload.user;
        state.isLogged = true;
        localStorage.setItem('token', action.payload.user.token);
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.status = 'failed';
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        }
        if (typeof action.payload === 'object') {
          state.response = action.payload;
        }
      })
      .addCase(fetchGetUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLogged = true;
      })
      .addCase(fetchGetUser.rejected, (state, action) => {
        state.status = 'failed to get user';
        if (typeof action.payload === 'string') {
          state.error = 'Try to re-sign in.';
          localStorage.removeItem('token');
        }
        if (typeof action.payload === 'object') {
          state.response = action.payload;
        }
      });
  },
});

export const { logIn, logOut, onInputChange, onPageChange } = userSlice.actions;

export default userSlice.reducer;
