import React ,{useContext, useEffect , useState} from'react';
import {useParams , useHistory} from 'react-router-dom';
import Input from '../../Shared/components/UI/Input';
import Button from '../../Shared/components/UI/Button';
import {VALIDATOR_REQUIRE, VALIDATOR_EMAIL} from '../../Shared/components/UI/Validators';
import {useForm}from'../../Shared/hooks/form-hook';
import {useHttpClient} from '../../Shared/hooks/http-hook';
import Spinner from '../../Shared/components/UI/LoadingSpinner';
import ErrorModal from '../../Shared/components/UI/ErrorModal';
import {AuthContext} from '../../Shared/Context/auth-context';
import Card from '../../Shared/components/UI/Card';
import ImageUpload from '../../Shared/components/UI/ImageUpload'

  const UpdatePlace = () => {
    const auth = useContext(AuthContext);
     const [LoadedUser , setLoadedUser]=useState();
    const {isLoading , error , sendRequest , clearerror}= useHttpClient();
    const userId = useParams().userId;
    const history = useHistory();
    const [formState, inputHandler, setFormData] = useForm(
      {
        email: {
          value: '',
          isValid: false
        },
        password: {
          value: '',
          isValid: false
        }
      },
      false
    );
  

  
    useEffect(()=>{
      const fetch=async ()=>{
        try{
         const responseData = await sendRequest( `${process.env.REACT_APP_URL}/edit/${userId}`)
         setLoadedUser(responseData.user);
         setFormData(
          {
            email: {
              value: responseData.user.email,
              isValid: true
            },
            description: {
              value: responseData.user.name,
              isValid: true
            },
            image:{
              value: responseData.user.image,
              isValid : true
            }
          },
          true
        )

        }catch(err){}
      }
      fetch();
    },[sendRequest , setFormData , userId])
   
   
    const placeUpdateSubmitHandler = async event => {
      event.preventDefault();
      // const formdata= new FormData();
      // formdata.append('title',formState.inputs.title.value )
      // formdata.append('description',formState.inputs.description.value )
      // formdata.append('image',formState.inputs.image.value )
let responseData;
    try{
      const formData = new FormData();
      formData.append('email', formState.inputs.email.value);
      formData.append('name', formState.inputs.name.value);
      formData.append('password', formState.inputs.password.value);
      formData.append('image', formState.inputs.image.value);
      responseData=formData;
     responseData= await sendRequest(  `${process.env.REACT_APP_URL}/${userId}/edit`,
     'PATCH',
    //  JSON.stringify({
    //   title: formState.inputs.title.value,
    //   description: formState.inputs.description.value,
    //   // image: formState.inputs.image.value
    // }),
     formData,
    {
      //  'Content-Type': 'application/json',
      Authorization: 'Bearer ' + auth.token
    }
    )
    console.log(responseData)
   
      history.push('/')
    }catch(err){   
      console.log(responseData)
      // console.log(formState.inputs.image)
      // console.log(formState.inputs.title)
      // console.log(formState.inputs.description)
      console.log(err.message)
     }
    };


    if (isLoading) {
      return (
        <div className="center">
         <Spinner/>
        </div>
      );
    }
    if (!LoadedUser && !error) {
      return (
        <div className="center">
          <h2>Could not find place!</h2>
        </div>
      );
    }
  
   <p>{LoadedUser}</p>
  
   return (
       <React.Fragment>
           <h1>UPDAADADAD</h1>
         {/* <ErrorModal error={error} Onclear={clearerror}/> */}
    {!isLoading && LoadedUser && (
       <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
           initialValue={LoadedUser.name}
           initialValid={true}
         />
    



      {!isLoading && LoadedUser && <ImageUpload center id="image" onInput={inputHandler}/>}
        <Input
          element="input"
          id="email"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
          initialValue={LoadedUser.email}
          initialValid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
        </form>)}
      </React.Fragment>
   )
// //     );
// return (
//     <h1>UPDATE</h1>
// )
  };
  export default UpdatePlace;