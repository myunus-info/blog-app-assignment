const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const { DataTypes } = require('sequelize');
const Comment = require(path.join(process.cwd(), 'src/modules/comment/comment.model'));
const User = require(path.join(process.cwd(), 'src/modules/user/user.model'));
const Like = require(path.join(process.cwd(), 'src/modules/like/like.model'));

const Post = sequelize.define(
  'posts',
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING(100),
    },
    content: {
      allowNull: false,
      type: DataTypes.STRING(2000),
    },
    keywords: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    category: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

User.hasMany(Post, { as: 'posts', foreignKey: 'user_id' });
Post.hasMany(Comment, { as: 'comments', foreignKey: 'post_id' });
Post.hasMany(Like, { as: 'likes', foreignKey: 'post_id' });

module.exports = Post;
