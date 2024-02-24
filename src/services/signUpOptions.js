export const signUpOptions = (register, errors, response, watch) => [
  {
    label: 'Username',
    name: 'username',
    type: 'text',
    validation: {
      ...register('username', {
        required: 'Username is required',
        minLength: { value: 3, message: 'Username needs to be at least 3 characters.' },
        maxLength: { value: 20, message: 'Username needs to be not more than 20 characters.' },
        pattern: {
          value: /^\S((?!.* {2}).*\S)?$/,
          message: 'Username must not start(end) with white-space nor contain 2 or more consecutive white-spaces.',
        },
      }),
    },
    error: errors.username ? <span>{errors.username.message}</span> : null,
    server: response.errors.username ? <span>{`Username ${response.errors.username}`}</span> : null,
  },
  {
    label: 'Email address',
    name: 'email',
    type: 'text',
    validation: {
      ...register('email', {
        required: 'Email address is required',
        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i, message: 'Email address needs to be correct.' },
      }),
    },
    error: errors.email ? <span>{errors.email.message}</span> : null,
    server: response.errors.email ? <span>{`Email address ${response.errors.email}`}</span> : null,
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
        pattern: {
          value: /^\S*$/,
          message: 'Password must not contain white-spaces.',
        },
      }),
    },
    error: errors.password ? <span>{errors.password.message}</span> : null,
  },
  {
    label: 'Repeat Password',
    name: 'repeat',
    type: 'password',
    placeholder: 'Password',
    validation: {
      ...register('repeat', {
        required: 'Password is required',
        validate: () => watch('repeat') === watch('password') || 'Passwords must match',
      }),
    },
    error: errors.repeat ? <span>{errors.repeat.message}</span> : null,
  },
];
