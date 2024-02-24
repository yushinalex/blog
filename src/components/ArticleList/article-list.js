import React, { useEffect } from 'react';
import { Pagination, ConfigProvider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import ArticleCard from '../ArticleCard';
import { fetchArticles, setCurrentPage } from '../../store/articlesSlice';
import Spinner from '../Spinner';
import ErrorMessage from '../ErrorMessage';

import styles from './article-list.module.scss';

function ArticleList() {
  const { articles, articlesCount, currentPage, status, error } = useSelector((state) => state.articlesSlice.all);

  const { isLogged } = useSelector((state) => state.userSlice);
  const { token } = useSelector((state) => state.userSlice.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isLogged !== null) {
      const page = currentPage;
      dispatch(fetchArticles({ page, token }));
    }
  }, [isLogged]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handlePage = (page) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchArticles({ page, token }));
  };

  const elements = articles.map((el) => (
    <li key={el.slug} className={styles['article-list-element']}>
      <ArticleCard {...el} />
    </li>
  ));

  const pagination = elements.length ? (
    <div className={styles['article-list-pagination']}>
      <ConfigProvider
        theme={{
          components: {
            Pagination: {
              itemSize: 24,
              itemActiveBg: '#1890ff',
              fontFamily: 'Inter',
              colorText: 'rgba(0, 0, 0, 0.75)',
              fontSize: 12,
              fontWeightStrong: 400,
            },
          },
        }}
      >
        <Pagination
          defaultCurrent={currentPage}
          current={currentPage}
          total={articlesCount}
          showSizeChanger={false}
          pageSize={5}
          onChange={(page) => handlePage(page)}
        />
      </ConfigProvider>
    </div>
  ) : null;

  return (
    <div className={styles.articles}>
      {status === 'loading' && <Spinner size={88} />}
      {status === 'failed' && <ErrorMessage error={error} />}
      <ul className={styles['article-list']}>{elements}</ul>
      {pagination}
    </div>
  );
}

export default ArticleList;
