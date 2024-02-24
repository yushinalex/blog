import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { fetchProfile, onInputChange, onPageChange } from '../../store/userSlice';
import { inputCreator } from '../../services/inputCreator';
import { editProfileOptions } from '../../services/editProfileOptions';
import styles from '../../styles/forms.module.scss';
import Spinner from '../Spinner';

function EditProfileForm() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onPageChange());
  }, []);

  const { response, status, error } = useSelector((state) => state.userSlice);
  const { token, username, email } = useSelector((state) => state.userSlice.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: 'onBlur', defaultValues: { username, email } });

  useEffect(() => {
    reset({ username, email });
  }, [username, email]);

  const serverErrorsHelper = (name) => dispatch(onInputChange(name));

  const options = editProfileOptions(register, errors, response);

  const elements = inputCreator(options, styles, errors, response, serverErrorsHelper);

  const onSubmit = (userData) => {
    const data = { token, userData };
    dispatch(fetchProfile(data));
  };

  return (
    <div className={styles.form}>
      <h2 className={styles.title}>Edit Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul className={styles.list}>{elements}</ul>
        <button className={styles.button} type="submit" disabled={!isValid}>
          Save
        </button>
        <div className={styles.result}>
          {status === 'loading' && <Spinner size={36} />}
          {status === 'completed' && (
            <div className={styles.success}>
              <span>Successfully updated!</span>
            </div>
          )}
          {error && (
            <div className={styles.fail}>
              <span>Failed to update! {error}!</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default EditProfileForm;
