const path = require('path');
const controller = require('./like.controller');
const AuthStrategy = require(path.join(
  process.cwd(),
  'src/modules/user/user.authentication.middleware'
));

module.exports = app => {
  app.post('/api/like', AuthStrategy, controller.likePost);
  app.post('/api/unlike', AuthStrategy, controller.unlikePost);
};
