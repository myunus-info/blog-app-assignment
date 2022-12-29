const path = require('path');
const bcrypt = require('bcryptjs');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const { DataTypes } = require('sequelize');

const User = sequelize.define(
  'users',
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(100),
    },
    username: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING(100),
      validate: {
        isEmail: true,
      },
      set(value) {
        this.setDataValue('username', value.toLowerCase());
      },
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, 8));
      },
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

User.prototype.isPasswordValid = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = User;
