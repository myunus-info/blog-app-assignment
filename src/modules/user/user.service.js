const path = require('path');
const jwt = require('jsonwebtoken');
const nodeCache = require(path.join(process.cwd(), 'src/config/lib/nodecache'));

const generateAccessToken = user => {
  const accessToken = jwt.sign({ id: user.id }, nodeCache.getValue('JWT_SECRET'), {
    expiresIn: nodeCache.getValue('JWT_EXPIRES'),
    issuer: user.id.toString(),
  });

  return accessToken;
};

module.exports = { generateAccessToken };
