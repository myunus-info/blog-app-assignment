const path = require('path');
const { asyncHandler, AppError } = require(path.join(process.cwd(), 'src/modules/core/errors'));
const Like = require(path.join(process.cwd(), 'src/modules/like/like.model'));
const Post = require(path.join(process.cwd(), 'src/modules/post/post.model'));

const likePost = asyncHandler(async (req, res, next) => {
  const { post_id } = req.body;
  const { id: user_id } = req.user;
  const post = await Post.findOne({ where: { id: post_id } });
  if (!post) {
    return next(new AppError(404, `No post found with Id: ${post_id}`));
  }
  const [like, created] = await Like.findOrCreate({
    where: { user_id, post_id },
    defaults: { post_id, user_id },
  });
  if (!created) {
    return next(new AppError(400, 'You have already liked this post'));
  }
  res.status(201).json({ like });
});

const unlikePost = asyncHandler(async (req, res, next) => {
  const { post_id } = req.body;
  const { id: user_id } = req.user;
  const like = await Like.findOne({ where: { post_id, user_id } });
  if (!like) {
    return next(new AppError(404, `No like found with Id: ${post_id}`));
  }
  await like.destroy();
  res.status(200).json({ like });
});

module.exports = {
  likePost,
  unlikePost,
};
