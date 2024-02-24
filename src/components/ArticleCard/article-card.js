import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Popconfirm } from 'antd';

import { fetchLike } from '../../store/articlesSlice';
import { fetchDeleteArticle, onArticleUpload } from '../../store/createArticleSlice';
import avatar from '../../assets/ava.png';

import styles from './article-card.module.scss';

function ArticleCard(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, username } = useSelector((state) => state.userSlice.user);
  const { status } = useSelector((state) => state.articlesSlice.single);
  const editStatus = useSelector((state) => state.createArticleSlice.status);
  const failed = useSelector((state) => state.createArticleSlice.error);

  const { author, createdAt, description, favoritesCount, tagList, title, slug, single, favorited } = props;
  const [image, setImage] = useState(author?.image || avatar);

  const elementClassName = (className) =>
    single ? `${styles[className]} ${styles[`${className}--full`]}` : `${styles[className]}`;

  const helper = (text) =>
    text.trim().length < 20 && text.trim().length > 0 && text.trim() ? text.trim() : `${text.trim().slice(0, 17)}...`;

  const tags = tagList.map((el, index) =>
    el ? (
      <span key={index} className={elementClassName('article-card-tag')}>
        {helper(el)}
      </span>
    ) : null
  );

  const handleDelete = () => {
    dispatch(fetchDeleteArticle({ slug, token }));
  };

  useEffect(() => {
    if (editStatus === 'deleted') {
      navigate('/');
      dispatch(onArticleUpload());
    }
  }, [editStatus]);

  return (
    <div className={styles['article-card']}>
      <div className={styles['article-card-top']}>
        <div className={styles['article-card-info']}>
          <div className={styles['article-card-header']}>
            <h5 className={elementClassName('article-card-tittle')}>
              <Link to={`/articles/${slug}`}>{title.trim()}</Link>
            </h5>
            <button
              onClick={() => {
                if (token) {
                  const method = favorited ? 'DELETE' : 'POST';
                  dispatch(fetchLike({ slug, token, method }));
                }
                if (!token) {
                  navigate('/sign-in');
                }
              }}
              type="button"
              className={styles['article-card-likes-button']}
            >
              <span className={favorited ? styles['article-card-heart'] : styles['article-card-no-heart']} />
              <div className={styles['article-card-likes-number']}>{favoritesCount || null}</div>
            </button>
          </div>
          <div className={styles['article-card-tags']}>{single ? tags.slice(0, 9) : tags.slice(0, 3)}</div>
        </div>
        <div className={styles['article-card-user']}>
          <span className={elementClassName('article-card-name')}>{author.username}</span>
          <span className={styles['article-card-date']}>{format(new Date(createdAt), 'MMMM dd, yyyy')}</span>
          <img
            className={styles['article-card-avatar']}
            src={image}
            onError={() => {
              setImage(avatar);
            }}
            alt="avatar"
          />
        </div>
      </div>
      <div className={styles['article-card-bottom']}>
        <div className={elementClassName('article-card-description')}>
          <p className={elementClassName('article-card-text')}>{description ? description.trim() : null}</p>
        </div>
        {status === 'completed' && username === author.username ? (
          <div className={styles['article-card-edit-buttons']}>
            <Popconfirm
              placement="rightTop"
              description="Are you sure to delete this article?"
              okText="Yes"
              cancelText="No"
              onConfirm={handleDelete}
              onCancel={() => {}}
            >
              <button className={styles['article-card-delete']} type="button">
                Delete
              </button>
            </Popconfirm>
            <Link className={styles['article-card-edit']} to={`/articles/${slug}/edit`}>
              Edit
            </Link>
          </div>
        ) : null}
        {failed && (
          <div className={styles.fail}>
            <span>Failed to update! {failed}!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleCard;
