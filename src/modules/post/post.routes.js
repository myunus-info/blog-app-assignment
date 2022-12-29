const path = require('path');
const controller = require('./post.controller');
const AuthStrategy = require(path.join(
  process.cwd(),
  'src/modules/user/user.authentication.middleware'
));

module.exports = app => {
  app.route('/api/posts').post(AuthStrategy, controller.createPost).get(controller.getPosts);

  app
    .route('/api/posts/:id')
    .get(AuthStrategy, controller.getPost)
    .put(AuthStrategy, controller.updatePost)
    .delete(AuthStrategy, controller.deletePost);
};
