const HttpError=require('../modals/http-error');
const {validationResult}=require("express-validator")
const User= require('../modals/user');
const bcrypt = require('bcrypt')
const jwt= require('jsonwebtoken');

const Signup=  async (req,res,next)=>{
 // console.log(req.body)
  // console.log(req.file)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    const { name, email, password } = req.body;
   
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again later.',
        500
      );
      return next(error);
    }
  
    if (existingUser) {
      const error = new HttpError(
        'User exists already, please login instead.',
        422
      );
      return next(error);
    }
   let hashpassword;
   try{
   hashpassword= await bcrypt.hash(password, 12 );
   }catch(err)
   {
     const error= new HttpError("Can not create a user" , 422)
     return nect(error)
   } 
   //console.log(req.body)
   const createdUser = new User({
      name,
      email,
      image: req.file.path,
      password : hashpassword,
      places: []
    });
   
    try {
      await createdUser.save();
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again later.',
        500
      );
      return next(error);
    }
  let token;
  try{
  token = jwt.sign(
    {userId : createdUser.id , email: createdUser.email},  //id is provided by mongoose
    "supersecret_dont_share",
    {expiresIn : '1h'}
  )} catch(err)
  {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
  res.status(201).json({userId:createdUser.id, email: createdUser.email , token: token });
  };
  
  



const gettheUsers= async (req,res,next)=>{
let users
 try{
     users=  await User.find({},'-password') //-password will deduct password from the data 
 }catch (err) {
   
    const error = new HttpError(
      'Fetching users failed , Try again',
      500
    );
   // console.log(err.message)
    return next(error);
  }

res.json({users: users.map(u=>u.toObject({getters:true }))})
    
}

const Update = async(req,res,next)=>{
  const {email,name,image} = req.body
  console.log(req.body)
}


const login=async (req,res,next)=>{ 
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email }); //find a user with that email address
  } catch (err) {
    const error = (
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
  
    return next('Invalid credentials, could not log you in.',401);
  }
  let isValid= false
  try{
    isValid= await bcrypt.compare(password,existingUser.password) //it will return a boolean
  }catch(err)
  {
   
    return next( 'Check your credentials, could not log you in.',
    500) 
  }
 if(!isValid)
 {
 
  return next( 'Invalid credentials, could not log you in.',
  401);
 }
let token ;
try{
token =jwt.sign({userId : existingUser.id , email: existingUser.email},
  "supersecret_dont_share",
  {expiresIn:'1h'}
  )}
  catch(err)
  {
    
      return next(  'Check your credentials, could not log you in.',
      500) 
  }
  res.json({
    message: 'Logged in!',
    userId: existingUser.id, email: existingUser.email , token:token
  });
}


exports.login=login;
exports.Signup=Signup;
exports.gettheUsers=gettheUsers;
exports.Update=Update