const { string, object } = require('yup');

const isEmailLengthValid = email => {
  if (email) {
    const part = email.split('@');
    const emailParts = part[0];
    return emailParts.length <= 64;
  }
  return true;
};

const registerSchema = object().shape({
  name: string()
    .max(100, 'This field must be at most 100 characters long')
    .required('This field must not be empty'),
  username: string()
    .email('This field should be a valid email address.')
    .max(100, 'Email must be at most 100 characters long.')
    .required('Email is required.')
    .test(
      'is-valid-email-length',
      'The part before @ of the email can be maximum 64 characters.',
      email => isEmailLengthValid(email)
    ),
  password: string()
    .min(6, 'Password must be at least 6 characters long')
    .max(50, 'This field must be at most 50 characters long')
    .required('Password must not be empty'),
});

const loginSchema = object().shape({
  username: string()
    .email('This field should be a valid email address.')
    .max(100, 'Email must be at most 100 characters long.')
    .required('Email is required.')
    .test(
      'is-valid-email-length',
      'The part before @ of the email can be maximum 64 characters.',
      email => isEmailLengthValid(email)
    ),
  password: string()
    .min(6, 'Password must be at least 6 characters long')
    .max(50, 'This field must be at most 50 characters long')
    .required('Password must not be empty'),
});

module.exports = {
  registerSchema,
  loginSchema,
};
