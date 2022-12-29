const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const { DataTypes } = require('sequelize');

const Like = sequelize.define(
  'likes',
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    post_id: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.UUID,
    },
  },
  {
    tableName: 'likes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Like;
