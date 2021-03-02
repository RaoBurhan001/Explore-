const express = require('express');
const {check}=require('express-validator');
const router = express.Router();
// const bodyParser=require('body-parser');
const HttpError = require('../modals/http-error');
const CheckAuth = require('../middlewares/auth-hook');
const placesControllers= require('../controllers/place-controller');
// const fileupload= require ('../middlewares/fileupload');
const fileUpload = require('../middlewares/fileupload');

router.get('/:pid', placesControllers.getPlacebyId);

router.get('/user/:uid', placesControllers.getPlacesbyUserId);
router.use(CheckAuth)
router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address')
      .not()
      .isEmpty()
  ],
  placesControllers.createPlace
);

router.patch(
  '/:pid',
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  placesControllers.Updateplace
);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
