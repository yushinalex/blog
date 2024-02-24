import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { fetchLogin, onInputChange, onPageChange } from '../../store/userSlice';
import { inputCreator } from '../../services/inputCreator';
import { signInOptions } from '../../services/signInOptions';
import styles from '../../styles/forms.module.scss';

function SignInForm() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onPageChange());
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onBlur' });

  const { response, error } = useSelector((state) => state.userSlice);

  const serverErrorsHelper = (name) => dispatch(onInputChange(name));

  const options = signInOptions(register, errors, response);

  const elements = inputCreator(options, styles, errors, response, serverErrorsHelper);

  const onSubmit = (userData) => dispatch(fetchLogin(userData));

  return (
    <div className={styles.form}>
      <h2 className={styles.title}>Sign In</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul className={styles.list}>{elements}</ul>
        <button className={styles.button} type="submit" disabled={!isValid}>
          Login
        </button>
        {error && (
          <div className={styles.fail}>
            <span>Failed to update! {error}!</span>
          </div>
        )}
        <div className={styles.question}>
          <span>
            Don’t have an account? <Link to="/sign-up">Sign Up</Link>.
          </span>
        </div>
      </form>
    </div>
  );
}

export default SignInForm;
