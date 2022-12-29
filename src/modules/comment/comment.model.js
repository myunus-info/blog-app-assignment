const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const { DataTypes } = require('sequelize');

const Comment = sequelize.define(
  'comments',
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    content: {
      allowNull: false,
      type: DataTypes.STRING(2000),
    },
    post_id: {
      allowNull: false,
      type: DataTypes.STRING(2000),
    },
  },

  {
    tableName: 'comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Comment;
