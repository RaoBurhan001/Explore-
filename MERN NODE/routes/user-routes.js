const express = require('express');
const {check}=require('express-validator');
const router = express.Router();
// const bodyParser=require('body-parser');
const HttpError = require('../modals/http-error');

const UsersControllers= require('../controllers/user-controller');
const upload = require('../middlewares/fileupload');


router.get('/',UsersControllers.gettheUsers)
  

router.post(
    '/signup',
    upload.single('image'),
    [
      check('name')
        .not()
        .isEmpty(),
      check('email')
        .normalizeEmail()
        .isEmail(),
      check('password').isLength({ min: 6 })
    ],
    UsersControllers.Signup
  );

router.post('/login',UsersControllers.login)

router.patch(
  '/:uid',
  //fileUpload.single('image'),
  [
    check('email')
      .not()
      .isEmpty(),
    check('password').isLength({ min: 5 })
  ],
  UsersControllers.Update
);



module.exports = router;
