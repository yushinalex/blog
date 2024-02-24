import { configureStore } from '@reduxjs/toolkit';

import articlesSlice from './articlesSlice';
import userSlice from './userSlice';
import createArticleSlice from './createArticleSlice';

export default configureStore({
  reducer: {
    articlesSlice,
    userSlice,
    createArticleSlice,
  },
});
