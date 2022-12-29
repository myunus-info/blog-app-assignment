const path = require('path');
const { asyncHandler, AppError } = require(path.join(process.cwd(), 'src/modules/core/errors'));
const Post = require(path.join(process.cwd(), 'src/modules/post/post.model'));
const Comment = require(path.join(process.cwd(), 'src/modules/comment/comment.model'));

const createComment = asyncHandler(async (req, res, next) => {
  const { content, post_id } = req.body;
  const post = await Post.findOne({ where: { id: post_id } });
  if (!post) {
    return next(new AppError(404, `No post found with Id: ${post_id}`));
  }
  const comment = await Comment.create({ content, post_id });
  res.status(201).json({ comment });
});

const getComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.findAll();
  if (comments.length < 1) {
    return next(new AppError(404, 'No comments found'));
  }
  res.status(200).json({ comments });
});

const getComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findOne({ where: { id } });
  if (!comment) {
    return next(new AppError(404, `No comment found with Id: ${id}`));
  }
  res.status(200).json({ comment });
});

const updateComment = asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  const { id } = req.params;
  const comment = await Comment.findOne({ where: { id } });
  if (!comment) {
    return next(new AppError(404, `No comment found with Id: ${id}`));
  }
  await comment.update({ content });
  res.status(200).json({ comment });
});

const deleteComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findOne({ where: { id } });
  if (!comment) {
    return next(new AppError(404, `No comment found with Id: ${id}`));
  }
  await comment.destroy();
  res.status(200).json({ comment });
});

module.exports = {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
};
