import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import ArticleCard from '../ArticleCard/article-card';
import { fetchSingleArticle } from '../../store/articlesSlice';
import Spinner from '../Spinner';
import ErrorMessage from '../ErrorMessage';

import styles from './article.module.scss';

function Article() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { isLogged } = useSelector((state) => state.userSlice);
  const { token } = useSelector((state) => state.userSlice.user);

  useEffect(() => {
    if (isLogged !== null) {
      dispatch(fetchSingleArticle({ slug, token }));
    }
  }, [isLogged]);

  const { article, status, error } = useSelector((state) => state.articlesSlice.single);

  const content =
    status === 'completed' ? (
      <article className={styles.article}>
        <ArticleCard {...article} single />
        <div className={styles['article-body']}>
          <Markdown>{article.body}</Markdown>
        </div>
      </article>
    ) : null;

  return (
    <div className={styles.wrapper}>
      {status === 'loading' && <Spinner size={88} />}
      {status === 'failed' && <ErrorMessage error={error} />}
      {content}
    </div>
  );
}

export default Article;
