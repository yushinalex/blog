import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logOut } from '../../store/userSlice';
import avatar from '../../assets/avasvg.svg';

import styles from './header.module.scss';

function Header() {
  const { isLogged } = useSelector((state) => state.userSlice);
  const { username, image } = useSelector((state) => state.userSlice.user);

  const dispatch = useDispatch();

  const loggedOutContent = (
    <div className={styles['header-links']}>
      <div className={[styles['header-link'], styles['header-link--in']].join(' ')}>
        <Link to="/sign-in">Sign In</Link>
      </div>
      <div className={[styles['header-link'], styles['header-link--up']].join(' ')}>
        <Link to="/sign-up">Sign Up</Link>
      </div>
    </div>
  );

  const loggedInContent = (
    <div className={[styles['header-links'], styles['header-links--in']].join(' ')}>
      <div className={[styles['header-link'], styles['header-link--create']].join(' ')}>
        <Link to="/new-article">Create article</Link>
      </div>
      <div className={styles['header-user']}>
        <span className={styles['header-username']}>
          <Link to="/profile">{username}</Link>
        </span>
        <Link to="/profile">
          <img className={styles['header-image']} src={image || avatar} alt="avatar" />
        </Link>
      </div>
      <button
        onClick={() => {
          dispatch(logOut());
        }}
        className={styles['header-button']}
        type="button"
      >
        Log Out
      </button>
    </div>
  );

  return (
    <section className={styles.header}>
      <h6 className={styles['header-tittle']}>
        <Link to="/">Realworld Blog</Link>
      </h6>
      {isLogged && loggedInContent}
      {!isLogged && loggedOutContent}
    </section>
  );
}

export default Header;
