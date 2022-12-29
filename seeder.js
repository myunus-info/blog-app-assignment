const init = async () => {
  const path = require('path');
  const async = require('async');
  const { initEnvironmentVariables } = require(path.join(process.cwd(), 'src/config'));
  await initEnvironmentVariables();
  const nodecache = require(path.join(process.cwd(), 'src/config/lib/nodecache'));
  const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
  await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${nodecache.getValue('DB_NAME')}`);
  require(path.join(process.cwd(), 'src/modules/post/post.model'));
  require(path.join(process.cwd(), 'src/modules/comment/comment.model'));
  require(path.join(process.cwd(), 'src/modules/like/like.model'));
  const User = require(path.join(process.cwd(), 'src/modules/user/user.model'));
  const Category = require(path.join(process.cwd(), 'src/modules/post/category.model'));
  await sequelize.sync();

  function userSeeder(callback) {
    User.findOrCreate({
      where: { username: 'admin@gmail.com' },
      defaults: { name: 'mahdi', password: '123456' },
    }).then(function () {
      callback();
    });
  }

  function categorySeeder(callback) {
    const categories = [
      { name: 'programming' },
      { name: 'sci-fi' },
      { name: 'movies' },
      { name: 'education' },
      { name: 'cooking' },
      { name: 'recipe' },
    ];
    Category.destroy({ truncate: { cascade: true } }).then(function () {
      Category.bulkCreate(categories, { returning: true, ignoreDuplicates: false }).then(function () {
        callback();
      });
    });
  }

  async.waterfall([userSeeder, categorySeeder], err => {
    if (err) console.error(err);
    else console.info('DB seed completed!');
    process.exit();
  });
};

init();
