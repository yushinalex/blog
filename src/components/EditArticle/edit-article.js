/* eslint-disable arrow-body-style */
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchSingleArticle } from '../../store/articlesSlice';
import { fetchUpdateArticle } from '../../store/createArticleSlice';
import NewArticleForm from '../NewArticleForm';

function EditArticle() {
  const title = 'Edit article';

  const dispatch = useDispatch();
  const { slug } = useParams();
  const { token } = useSelector((state) => state.userSlice);

  useEffect(() => {
    dispatch(fetchSingleArticle({ slug, token }));
  }, []);

  const { article } = useSelector((state) => state.articlesSlice.single);

  return (
    <div>
      <NewArticleForm title={title} article={article} update={fetchUpdateArticle} />
    </div>
  );
}

export default EditArticle;
