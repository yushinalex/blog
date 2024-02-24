import React, { useEffect } from 'react';
import { Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { fetchRegister, onInputChange, onPageChange } from '../../store/userSlice';
import { inputCreator } from '../../services/inputCreator';
import { signUpOptions } from '../../services/signUpOptions';
import styles from '../../styles/forms.module.scss';

function SignUpForm() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onPageChange());
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm({ mode: 'onBlur' });

  const { response, error } = useSelector((state) => state.userSlice);

  const serverErrorsHelper = (name) => dispatch(onInputChange(name));

  const options = signUpOptions(register, errors, response, watch);

  const elements = inputCreator(options, styles, errors, response, serverErrorsHelper);

  const onSubmit = (userData) => dispatch(fetchRegister(userData));

  return (
    <div className={styles.form}>
      <h2 className={styles.title}>Create new account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul className={styles.list}>{elements}</ul>
        <div className={styles.agree}>
          <Controller
            name="Checkbox"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange } }) => (
              <Checkbox onChange={onChange}>
                <span>I agree to the processing of my personal information</span>
              </Checkbox>
            )}
          />
        </div>
        <button className={styles.button} type="submit" disabled={!isValid}>
          Create
        </button>
        {error && (
          <div className={styles.fail}>
            <span>Failed to update! {error}!</span>
          </div>
        )}
        <div className={styles.question}>
          <span>
            Already have an account? <Link to="/sign-in">Sign In</Link>.
          </span>
        </div>
      </form>
    </div>
  );
}

export default SignUpForm;
