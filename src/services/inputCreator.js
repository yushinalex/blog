/* eslint-disable jsx-a11y/label-has-associated-control */
export const inputCreator = (options, styles, errors, response, helper) =>
  options.map((el) => (
    <li key={el.label} className={styles.element}>
      <label onChange={(e) => helper(e.target.name)} className={styles.label}>
        <span>{el.label}</span>
        <input
          className={
            errors[el.name] || response.errors[el.name] || response.errors['email or password']
              ? `${styles.input} ${styles['input--error']}`
              : styles.input
          }
          type={el.type}
          placeholder={el.placeholder || el.label}
          {...el.validation}
        />
      </label>
      <div className={styles['error-message']}>{el.error}</div>
      <div className={styles['error-message']}>{el.server}</div>
    </li>
  ));
