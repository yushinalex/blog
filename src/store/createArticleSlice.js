import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { fetchSome } from '../services/fetchSome';

const baseUrl = 'https://blog.kata.academy/api/';

export const fetchNewArticle = createAsyncThunk('createArticle/fetchNewArticle', async (data, { rejectWithValue }) => {
  const url = `${baseUrl}articles`;
  const { token, userData } = data;

  const { title, description, body, tags } = userData;

  const tagList = tags.map((el) => el.value);

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      article: {
        title,
        description,
        body,
        tagList,
      },
    }),
  };

  return fetchSome(url, rejectWithValue, options);
});

export const fetchDeleteArticle = createAsyncThunk(
  'createArticle/fetchDeleteArticle',
  async (data, { rejectWithValue }) => {
    const { slug, token } = data;
    const url = `${baseUrl}articles/${slug}`;

    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    return fetchSome(url, rejectWithValue, options);
  }
);

export const fetchUpdateArticle = createAsyncThunk(
  'createArticle/fetchUpdateArticle',
  async (data, { rejectWithValue }) => {
    const { link, token, userData } = data;
    const url = `${baseUrl}articles/${link}`;

    const { title, description, body, tags } = userData;

    const tagList = tags.map((el) => el.value).filter((el) => el !== '');

    const options = {
      method: 'PUT',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        article: {
          title,
          description,
          body,
          tagList,
        },
      }),
    };

    return fetchSome(url, rejectWithValue, options);
  }
);

const initial = {
  article: {
    slug: null,
    title: null,
    description: null,
    body: null,
    tagList: [],
    createdAt: null,
    updatedAt: null,
    favorited: null,
    favoritesCount: null,
    author: {
      username: null,
      bio: null,
      image: null,
      following: null,
    },
  },
  status: null,
  error: null, // error message
  response: { errors: { body: null } },
};

const createArticleSlice = createSlice({
  name: 'createArticle',
  initialState: initial,
  reducers: {
    onArticleUpload(state) {
      state = initial;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewArticle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.response = { errors: { body: null } };
      })
      .addCase(fetchNewArticle.fulfilled, (state, action) => {
        state.status = 'completed';
        state.article = action.payload.article;
      })
      .addCase(fetchNewArticle.rejected, (state, action) => {
        state.status = 'failed';
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        }
        if (typeof action.payload === 'object') {
          state.response = action.payload;
        }
      })
      .addCase(fetchDeleteArticle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.response = { errors: { body: null } };
      })
      .addCase(fetchDeleteArticle.fulfilled, (state) => {
        state.status = 'deleted';
      })
      .addCase(fetchDeleteArticle.rejected, (state, action) => {
        state.status = 'failed';
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        }
        if (typeof action.payload === 'object') {
          state.response = action.payload;
        }
      })
      .addCase(fetchUpdateArticle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.response = { errors: { body: null } };
      })
      .addCase(fetchUpdateArticle.fulfilled, (state, action) => {
        state.status = 'completed';
        state.article = action.payload.article;
      })
      .addCase(fetchUpdateArticle.rejected, (state, action) => {
        state.status = 'failed';
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        }
        if (typeof action.payload === 'object') {
          state.response = action.payload;
        }
      });
  },
});

export const { onArticleUpload } = createArticleSlice.actions;

export default createArticleSlice.reducer;
