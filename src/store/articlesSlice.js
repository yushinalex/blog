/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { fetchSome } from '../services/fetchSome';

const baseUrl = 'https://blog.kata.academy/api/';

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async (data, { rejectWithValue }) => {
  const { page, token } = data;

  const limit = 5;
  const offset = limit * (page - 1);
  const url = `${baseUrl}articles?offset=${offset}&limit=${limit}`;

  if (token) {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    return fetchSome(url, rejectWithValue, options);
  }

  return fetchSome(url, rejectWithValue);
});

export const fetchSingleArticle = createAsyncThunk('articles/fetchSingleArticle', async (data, { rejectWithValue }) => {
  const { slug, token } = data;
  const url = `${baseUrl}articles/${slug}`;

  if (token) {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    return fetchSome(url, rejectWithValue, options);
  }

  return fetchSome(url, rejectWithValue);
});

export const fetchLike = createAsyncThunk('articles/fetchLike', async (data, { rejectWithValue }) => {
  const { slug, token, method } = data;

  const url = `${baseUrl}articles/${slug}/favorite`;

  const options = {
    method,
    headers: {
      Authorization: `Token ${token}`,
    },
  };

  return fetchSome(url, rejectWithValue, options);
});

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    all: {
      articles: [
        {
          slug: null,
          title: '',
          description: null,
          body: null,
          tagList: [null],
          createdAt: null,
          updatedAt: null,
          favorited: false,
          favoritesCount: null,
          author: {
            username: null,
            bio: null,
            image: null,
            following: null,
          },
        },
      ],
      articlesCount: null,
      currentPage: 1,
      status: null, // 'loading', 'completed', 'failed'
      error: null, // error message
    },
    single: {
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
      status: null, // 'loading', 'completed', 'failed'
      error: null, // error message
    },
  },
  reducers: {
    setCurrentPage(state, action) {
      state.all.currentPage = action.payload;
    },
    setSingleDefault(state) {
      state.single = {
        status: null,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.all.status = 'loading';
        state.all.error = null;
        state.single.status = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.all.status = 'completed';
        state.all.articles = action.payload.articles;
        state.all.articlesCount = action.payload.articlesCount;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.all.status = 'failed';
        state.all.error = action.payload;
      })
      .addCase(fetchSingleArticle.pending, (state) => {
        state.single.status = 'loading';
        state.single.error = null;
        state.all.status = null;
      })
      .addCase(fetchSingleArticle.fulfilled, (state, action) => {
        state.single.status = 'completed';
        state.single.article = action.payload.article;
      })
      .addCase(fetchSingleArticle.rejected, (state, action) => {
        state.single.status = 'failed';
        state.single.error = action.payload;
      })
      .addCase(fetchLike.pending, (state) => {
        state.single.error = null;
      })
      .addCase(fetchLike.fulfilled, (state, action) => {
        if (state.single.status === 'completed') {
          state.single.article.favorited = action.payload.article.favorited;
          state.single.article.favoritesCount = action.payload.article.favoritesCount;
        }
        if (state.all.status === 'completed') {
          const index = state.all.articles.findIndex((el) => el.slug === action.payload.article.slug);
          if (index !== -1) {
            state.all.articles[index].favorited = action.payload.article.favorited;
            state.all.articles[index].favoritesCount = action.payload.article.favoritesCount;
          }
        }
      })
      .addCase(fetchLike.rejected, (state, action) => {
        state.single.status = 'failed to like';
        state.single.error = action.payload;
      });
  },
});

export const { setCurrentPage, setSingleDefault } = articlesSlice.actions;

export default articlesSlice.reducer;
