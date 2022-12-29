const path = require('path');
const { asyncHandler, AppError } = require(path.join(process.cwd(), 'src/modules/core/errors'));
const Post = require(path.join(process.cwd(), 'src/modules/post/post.model'));
const Comment = require(path.join(process.cwd(), 'src/modules/comment/comment.model'));
const Like = require(path.join(process.cwd(), 'src/modules/like/like.model'));

const createPost = asyncHandler(async (req, res, next) => {
  const { title, content, keywords, category } = req.body;
  const { id: user } = req.user;
  const [post, created] = await Post.findOrCreate({
    where: { title },
    defaults: { title, content, keywords, user_id: user, category },
  });
  if (!created) {
    return next(new AppError(400, 'Post already exists!'));
  }
  res.status(201).json({ post });
});

const getPosts = asyncHandler(async (req, res, next) => {
  const page = req.query.page ? req.query.page - 1 : 0;
  if (page < 0) {
    return next(new AppError(400, 'Page must be greater than or equal to 0'));
  }
  const query = req.query.keywords
    ? req.query.keywords
    : req.query.content
    ? req.query.content
    : req.query.category
    ? req.query.category
    : '';
  const limit = req.query.limit ? +rq.query.limit : 5;
  const offset = page * limit;
  const order = [
    ['created_at', 'DESC'],
    ['id', 'DESC'],
  ];

  const { count: postCount, rows: posts } = await Post.findAndCountAll({
    include: [
      {
        model: Comment,
        as: 'comments',
      },
      {
        model: Like,
        as: 'likes',
      },
    ],
    offset,
    limit,
    order,
    query,
  });

  const totalPosts = postCount;
  const data = {
    posts,
    metaData: {
      page: page + 1,
      limit,
      total: totalPosts,
      start: limit * page + 1,
      end: offset + limit > totalPosts ? totalPosts : offset + limit,
    },
  };

  res.status(200).json({ data });
});

const getPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findOne({ where: { id } });
  if (!post) {
    return next(new AppError(404, `No post found with Id: ${id}`));
  }
  res.status(200).json({ post });
});

const updatePost = asyncHandler(async (req, res, next) => {
  const { title, content, keywords } = req.body;
  const { id } = req.params;
  const post = await Post.findOne({ where: { id } });
  if (!post) {
    return next(new AppError(404, `No post found with Id: ${id}`));
  }
  await post.update({ title, content, keywords });
  res.status(200).json({ post });
});

const deletePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findOne({ where: { id } });
  if (!post) {
    return next(new AppError(404, `No post found with Id: ${id}`));
  }
  await post.destroy();
  res.status(200).json({ post });
});

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
