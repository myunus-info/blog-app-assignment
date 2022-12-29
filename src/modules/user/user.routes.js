const path = require('path');
const controller = require('./user.controller');
const AuthStrategy = require(path.join(
  process.cwd(),
  '/src/modules/user/user.authentication.middleware'
));
const validate = require(path.join(process.cwd(), 'src/modules/core/middleware/validator.middleware'));
const { registerSchema, loginSchema } = require('./user.schema');

module.exports = app => {
  app.post('/api/signup', validate(registerSchema), controller.signup);
  app.post('/api/login', validate(loginSchema), controller.login);
  app.get('/api/users/:id', AuthStrategy, controller.getSignedInUserProfile);
};
