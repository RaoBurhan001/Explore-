const HttpError= require('../modals/http-error');
const {validationResult}=require("express-validator")
//const getCords= require('../util/location');
const Place= require('../modals/places');
// const  {Mongoose}  = require('mongoose');
const mongoose = require ('mongoose');
const User = require('../modals/user');
const fs= require('fs');


const getPlacebyId= async (req,res,next)=>{
const placeId = req.params.pid; // { pid: 'p1' }

let place;
try{
   place =  await Place.findById(placeId)
}
catch(err)
{
  const error = new HttpError("Could not find the place" ,500) ;
  return next(error);
}

  if (!place) {
    const error= HttpError('Could not find a place for the provided id.',404);
    return next(error);
  }

  res.json({ place:place.toObject({getters: true}) }); // => { place } => { place: place } place.toObject is added to convert the key into string
};

const getPlacesbyUserId=async (req,res,next)=>{


  let places;  
  const userId = req.params.uid;
try{
   places = await Place.find({creator: userId})
}
catch(err){

  return next("Fetching Place is not possible" ,500);
}

    if (!places || places.length==0) {
    //  return next('Could not find a place for the provided id.',500 );
    }
  
    res.json({ places: places.map(place=> place.toObject({getters : true})) });

}

const createPlace = async (req, res, next) => {
  //console.log(req.body)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  // console.log(errors)

  const { title, description, address } = req.body;

  // let coordinates;
  // try {
  //   coordinates = await getCoordsForAddress(address);
  // } catch (error) {
  //   return next(error);
  // }

  const createdPlace = new Place({
    title,
    description,
    address,
    // location: coordinates,
    image: req.file.path,
    creator:req.userData.userId
  });
  console.log(createdPlace)
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }
//  console.log(creator)
//  console.log(req.body)
  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  console.log(user);


try {
  const sess = await mongoose.startSession();
  sess.startTransaction();
  await createdPlace.save(); 
  user.places.push(createdPlace); 
  await user.save(); 
  await sess.commitTransaction();
} catch (err) {
  const error = new HttpError(
    console.log(err.message),
    'Creating place failed, please try again.',
    500
  );
  return next(error);
}


res.status(201).json({ place: createdPlace });
}

const deletePlace= async (req,res,next)=>{
const placeId=req.params.pid;
let place;
try{
 place= await  Place.findById(placeId).populate('creator')
}
catch(err)
{
  return next("Could not Delete place, Something went wrong",500);
}
if (!place) {
  return next('Could not find a place for the provided id.',404);
}
let imagepath= place.image;
console.log(imagepath)

if(place.creator.id.toString() !== req.userData.userId)
{
  
  return next('Could not Delete a place you are not Authorized',404);
}
try{
  const sess= await mongoose.startSession();
  sess.startTransaction();
  await place.remove();
  place.creator.places.pull(place);
  await place.creator.save();
  await sess.commitTransaction();
}
catch(err)
{
  return next(new HttpError("Could not Delete place, Something went wrong",500));
}
fs.unlink(imagepath, err=>{
  console.log(err)
});

res.json('The place is deleted');


}

const Updateplace= async (req,res,next)=>{
  // const errors=validationResult(req);

  // if(!errors.isEmpty())
  // {
  //   return next( new HttpError("The entered credentials are not valid",422));
  // }
  console.log(req.body)
const{title,description, image}= req.body;
console.log(req.body)
// console.log(req.file.path)
const placeId= req.params.pid
let updateplace;
try{
updateplace=await Place.findById(placeId)
}
catch(err)
{
  return next(new HttpError("Could not Update place, Something went wrong",500));
}

// if(updateplace.creator.toString() !== req.userData.userId)
// {
//   return next("You are not Authenticated to edit this place",401);
// }
updateplace.title=title
updateplace.description=description
updateplace.image = req.file.path
// updateplace.image=req.file.path
try{
 await updateplace.save();
}catch(err)
{
  // console.log(err)
  return next(new HttpError("Could not Update place, Something went wrong",500));
}

res.status(201).json({place:updateplace.toObject({getters:true})})

}


exports.getPlacebyId=getPlacebyId;
exports.getPlacesbyUserId=getPlacesbyUserId;
exports.createPlace =createPlace;
exports.deletePlace=deletePlace;
exports.Updateplace=Updateplace;