const HttpError = require("../modals/http-error");
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
    console.log(token)
  } catch (err) {
     
    const error = new HttpError('Authentication failed!', 401);
    console.log(error)
    return next(error);
  }
};
