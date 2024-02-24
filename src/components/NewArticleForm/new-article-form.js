/* eslint-disable arrow-body-style */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchNewArticle, onArticleUpload } from '../../store/createArticleSlice';
import { setSingleDefault } from '../../store/articlesSlice';

import styles from './new-article-form.module.scss';

function NewArticleForm(props) {
  const { title, article, update } = props;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.userSlice.user);
  const { response, status, error } = useSelector((state) => state.createArticleSlice);
  const { slug } = useSelector((state) => state.createArticleSlice.article);

  useEffect(() => {
    if (status === 'completed') {
      navigate(`/articles/${slug}`);
      dispatch(setSingleDefault());
      dispatch(onArticleUpload());
    }
  }, [status]);

  let tagList = [];

  if (article) {
    tagList = article.tagList.map((el) => {
      return { value: el };
    });
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      title: article?.title || '',
      description: article?.description || '',
      body: article?.body || '',
      tags: tagList.length ? tagList : [{ value: '' }],
    },
  });

  useEffect(() => {
    if (article) {
      reset({ title: article.title, description: article.description, body: article.body, tags: tagList });
    }
  }, [article]);

  const { fields, append, remove } = useFieldArray({
    name: 'tags',
    control,
  });

  const tags = fields.map((field, index) => (
    <li key={field.id} className={styles.tag}>
      <div>
        <input
          {...register(`tags.${index}.value`, {
            required: false,
            minLength: { value: 1, message: 'Tag needs to be at least 1 character.' },
            maxLength: { value: 20, message: 'Tag needs to be not more than 20 characters.' },
            pattern: {
              value: /^\S((?!.* {2}).*\S)?$/,
              message: 'Tag must not start(end) with white-space nor contain 2 or more consecutive white-spaces.',
            },
          })}
          className={
            errors.tags?.[index]
              ? [styles.input, styles['input--tag'], styles['input--error']].join(' ')
              : [styles.input, styles['input--tag']].join(' ')
          }
          placeholder="Tag"
        />
        <div className={[styles['error-message'], styles['error-tag']].join(' ')}>
          {errors.tags ? <span>{errors.tags?.[index]?.value.message}</span> : null}
        </div>
      </div>
      <button
        className={styles['delete-tag']}
        onClick={() => {
          remove(index);
        }}
        type="button"
      >
        Delete
      </button>
      <button
        className={styles['add-tag']}
        onClick={() => {
          append({ value: '' });
        }}
        type="button"
        disabled={fields.length >= 10}
      >
        Add tag
      </button>
    </li>
  ));

  const onSubmit = (userData) => {
    if (!update) {
      const data = { token, userData };
      dispatch(fetchNewArticle(data));
      reset();
    }
    if (update) {
      const link = article.slug;
      dispatch(update({ link, token, userData }));
      reset();
    }
  };

  return (
    <div className={styles.form}>
      <h2 className={styles.title}>{title || 'Create new article'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles['article-inputs']}>
        <div>
          <label className={styles.label}>
            <span>Title</span>
            <input
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 2, message: 'Title needs to be at least 2 characters.' },
                maxLength: { value: 50, message: 'Title needs to be not more than 50 characters.' },
                pattern: {
                  value: /^\S((?!.* {2}).*\S)?$/,
                  message: 'Title must not start(end) with white-space nor contain 2 or more consecutive white-spaces.',
                },
              })}
              className={errors.title ? [styles.input, styles['input--error']].join(' ') : styles.input}
              placeholder="Title"
            />
          </label>
          <div className={styles['error-message']}>{errors.title ? <span>{errors.title.message}</span> : null}</div>
          <div className={styles['error-message']}>
            {response.errors.title ? <span>{response.errors.title.message}</span> : null}
          </div>
        </div>
        <div>
          <label className={styles.label}>
            <span>Short description</span>
            <input
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 3, message: 'Description needs to be at least 3 characters.' },
                maxLength: { value: 200, message: 'Description needs to be not more than 200 characters.' },
                pattern: {
                  value: /^\S((?!.* {2}).*\S)?$/,
                  message:
                    'Description must not start(end) with white-space nor contain 2 or more consecutive white-spaces.',
                },
              })}
              className={errors.description ? [styles.input, styles['input--error']].join(' ') : styles.input}
              placeholder="Short description"
            />
          </label>
          <div className={styles['error-message']}>
            {errors.description ? <span>{errors.description.message}</span> : null}
          </div>
          <div className={styles['error-message']}>
            {response.errors.description ? <span>{response.errors.description.message}</span> : null}
          </div>
        </div>
        <div>
          <label className={styles.label}>
            <span>Text</span>
            <textarea
              {...register('body', {
                required: 'Text is required',
                minLength: { value: 5, message: 'Text needs to be at least 5 characters.' },
                maxLength: { value: 5000, message: 'Text needs to be not more than 5000 characters.' },
              })}
              className={
                errors.body
                  ? [styles.input, styles['input--error'], styles.textarea].join(' ')
                  : [styles.input, styles.textarea].join(' ')
              }
              placeholder="Text"
            />
          </label>
          <div className={styles['error-message']}>{errors.body ? <span>{errors.body.message}</span> : null}</div>
          <div className={styles['error-message']}>
            {response.errors.body ? <span>{response.errors.body.message}</span> : null}
          </div>
        </div>
        <div className={styles['tags-wrapper']}>
          <div className={styles.tags}>
            <span>Tags</span>
            {tags.length ? <ul className={styles['tag-list']}>{tags}</ul> : null}
            {!tags.length && (
              <button
                className={[styles['add-tag'], styles['add-tag--show']].join(' ')}
                onClick={() => {
                  append({ value: '' });
                }}
                type="button"
              >
                Add tag
              </button>
            )}
          </div>
        </div>
        <button className={styles.button} type="submit" disabled={!isValid}>
          Send
        </button>
        {error && (
          <div className={styles.fail}>
            <span>Failed to update! {error}!</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default NewArticleForm;
