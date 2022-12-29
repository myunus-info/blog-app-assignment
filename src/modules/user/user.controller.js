const path = require('path');
const { generateAccessToken } = require('./user.service');
const { asyncHandler, AppError } = require(path.join(process.cwd(), 'src/modules/core/errors'));
const User = require(path.join(process.cwd(), 'src/modules/user/user.model'));
const Post = require(path.join(process.cwd(), 'src/modules/post/post.model'));
const Comment = require(path.join(process.cwd(), 'src/modules/comment/comment.model'));

const signup = asyncHandler(async (req, res, next) => {
  const { name, username, password } = req.body;
  const [user, created] = await User.findOrCreate({
    where: { username },
    defaults: { name, username, password },
  });
  if (!created) {
    return next(new AppError(400, 'User already exists!'));
  }
  res.status(201).json({ user });
});

const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || !user.password || !user.isPasswordValid(password)) {
    return next(new AppError(401, 'Invalid email or password'));
  }
  res.cookie('accessToken', generateAccessToken(user), {
    httpOnly: true,
    sameSite: true,
    signed: true,
  });
  const { password: Password, createdAt, updatedAt, ...userRestInfo } = user.dataValues;
  res.status(200).json({ user: userRestInfo });
});

const getSignedInUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: Post,
        as: 'posts',
        include: [
          {
            model: Comment,
            as: 'comments',
          },
        ],
      },
    ],
  });
  if (!user) {
    return next(new AppError(404, 'User not found!'));
  }
  res.status(200).json({ user });
});

module.exports = {
  signup,
  login,
  getSignedInUserProfile,
};
