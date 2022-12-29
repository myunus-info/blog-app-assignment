const path = require('path');
const controller = require('./comment.controller');
const AuthStrategy = require(path.join(
  process.cwd(),
  'src/modules/user/user.authentication.middleware'
));

module.exports = app => {
  app.route('/api/comments').post(AuthStrategy, controller.createComment).get(controller.getComments);

  app
    .route('/api/comments/:id')
    .get(AuthStrategy, controller.getComment)
    .put(AuthStrategy, controller.updateComment)
    .delete(AuthStrategy, controller.deleteComment);
};
