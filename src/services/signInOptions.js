export const signInOptions = (register, errors, response) => [
  {
    label: 'Email address',
    name: 'address',
    type: 'text',
    validation: {
      ...register('address', {
        required: 'Email address is required',
        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i, message: 'Email address needs to be correct.' },
      }),
    },
    error: errors.address ? <span>{errors.address.message}</span> : null,
    server: response.errors['email or password'] ? (
      <span>{`Email or password ${response.errors['email or password']}`}</span>
    ) : null,
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    validation: {
      ...register('password', {
        required: 'Password is required',
        minLength: { value: 6, message: 'Password needs to be at least 6 characters.' },
        maxLength: { value: 40, message: 'Password needs to be not more than 40 characters.' },
      }),
    },
    error: errors.password ? <span>{errors.password.message}</span> : null,
    server: response.errors['email or password'] ? (
      <span>{`Email or password ${response.errors['email or password']}`}</span>
    ) : null,
  },
];
