const express=require('express');
const bodyParser= require('body-parser');
const path=require('path')
const mongoose=require('mongoose');
const fs= require('fs');
const app=express();
// const multer= require('multer');
// const upload = multer()
//var cors = require('cors')
// const URL=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k1ybs.mongodb.net/${process.env.DB_NAME}`
const URL = 'mongodb://localhost:27017/explore2'
const HttpError= require('./modals/http-error');

const PlacesRoutes=require('./routes/places-route')
const UserRoutes=require('./routes/user-routes');


//app.use(cors())
console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)
console.log(process.env.DB_NAME)
// console.log(process.env.JWT_KEY)
app.use(bodyParser.json())
// app.use(upload.array()); 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('',express.static(path.join('','')))

app.use('/api/places',PlacesRoutes)
app.use('/api/users',UserRoutes);


app.use((req,res,next)=>{
    error= new HttpError("Could not load this route",404);
    console.log(error.message)
    console.log(req.path)
    throw error;
})

app.use((error,req,res,next)=>{
if (req.file)
{
  fs.unlink(req.file.path , err=>{
    console.log(err)
  })
}
    if(res.headerSent)
    {
        return next(error)
    }
    res.status(error.status || 500)
     res.json({message:error || 'An unknown error has occured'})
     console.log(error)
})

mongoose.connect(URL, {
  
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    retryWrites: false
  }
 );

// On Connection

mongoose.connection.on("connected ",  () => {
  console.log("Connected to database " );
});

// // On Error
// mongoose.connection.on("error", (err) => {
//   console.log("Database error: " + err);
// });

app.listen(5000, () => {
    console.log("Server started on port " + 5000);
  });


