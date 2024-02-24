import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from '../Header';
import ArticleList from '../ArticleList';
import Article from '../Article';
import SignUpForm from '../SignUpForm';
import SignInForm from '../SignInForm';
import EditProfileForm from '../EditProfileForm';
import NewArticleForm from '../NewArticleForm';
import EditArticle from '../EditArticle';
import RequireLogIn from '../../routes/RequireLogIn';
import RequireLogOut from '../../routes/RequireLogOut';
import { fetchGetUser, logIn } from '../../store/userSlice';

import styles from './app.module.scss';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchGetUser(token));
    }
    if (!token) {
      dispatch(logIn(false));
    }
  }, []);

  return (
    <div className={styles.app}>
      <Header />
      <Routes>
        <Route path="/" element={<ArticleList />} />
        <Route path="/articles/" element={<ArticleList />} />
        <Route path="/articles/:slug" element={<Article />} />
        <Route
          path="/articles/:slug/edit"
          element={
            <RequireLogIn>
              <EditArticle />
            </RequireLogIn>
          }
        />
        <Route
          path="/sign-up"
          element={
            <RequireLogOut>
              <SignUpForm />
            </RequireLogOut>
          }
        />
        <Route
          path="/sign-in"
          element={
            <RequireLogOut>
              <SignInForm />
            </RequireLogOut>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireLogIn>
              <EditProfileForm />
            </RequireLogIn>
          }
        />
        <Route
          path="/new-article"
          element={
            <RequireLogIn>
              <NewArticleForm />
            </RequireLogIn>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
