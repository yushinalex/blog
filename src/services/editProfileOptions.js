export const editProfileOptions = (register, errors, response) => [
  {
    label: 'Username',
    name: 'username',
    type: 'text',
    validation: {
      ...register('username', {
        required: false,
        minLength: { value: 3, message: 'Username needs to be at least 3 characters.' },
        maxLength: { value: 20, message: 'Username needs to be not more than 20 characters.' },
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
        required: false,
        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i, message: 'Email address needs to be correct.' },
      }),
    },
    error: errors.email ? <span>{errors.email.message}</span> : null,
    server: response.errors.email ? <span>{`Email address ${response.errors.email}`}</span> : null,
  },
  {
    label: 'New password',
    name: 'password',
    type: 'password',
    validation: {
      ...register('password', {
        required: false,
        minLength: { value: 6, message: 'Password needs to be at least 6 characters.' },
        maxLength: { value: 40, message: 'Password needs to be not more than 40 characters.' },
      }),
    },
    error: errors.password ? <span>{errors.password.message}</span> : null,
  },
  {
    label: 'Avatar image (url)',
    name: 'image',
    type: 'text',
    placeholder: 'Avatar image',
    validation: {
      ...register('image', {
        required: false,
        pattern: { value: /^(https):\/\/[^ "]+$/, message: 'Url needs to be correct.' },
      }),
    },
    error: errors.image ? <span>{errors.image.message}</span> : null,
  },
];
