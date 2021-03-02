import React ,{useContext, useEffect , useState} from'react';
import {useParams , useHistory} from 'react-router-dom';
import Input from '../../Shared/components/UI/Input';
import Button from '../../Shared/components/UI/Button';
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from '../../Shared/components/UI/Validators';
import {useForm}from'../../Shared/hooks/form-hook';
import {useHttpClient} from '../../Shared/hooks/http-hook';
import Spinner from '../../Shared/components/UI/LoadingSpinner';
import ErrorModal from '../../Shared/components/UI/ErrorModal';
import {AuthContext} from '../../Shared/Context/auth-context';
import Card from '../../Shared/components/UI/Card';
import ImageUpload from '../../Shared/components/UI/ImageUpload'

  const UpdatePlace = () => {
    const auth = useContext(AuthContext);
    const [LoadedPlace , setLoadedPlace]=useState();
    const {isLoading , error , sendRequest , clearerror}= useHttpClient();
    const placeId = useParams().placeId;
    const history = useHistory();
    const [formState, inputHandler, setFormData] = useForm(
      {
        title: {
          value: '',
          isValid: false
        },
        description: {
          value: '',
          isValid: false
        }
      },
      false
    );
  

  
    useEffect(()=>{
      const fetch=async ()=>{
        try{
         const responseData = await sendRequest( `${process.env.REACT_APP_URL}/places/${placeId}`)
         setLoadedPlace(responseData.place);
         setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true
            },
            description: {
              value: responseData.place.description,
              isValid: true
            },
            image:{
              value: responseData.place.image,
              isValid : true
            }
          },
          true
        )

        }catch(err){}
      }
      fetch();
    },[sendRequest , setFormData , placeId])
   
   
    const placeUpdateSubmitHandler = async event => {
      event.preventDefault();
      // const formdata= new FormData();
      // formdata.append('title',formState.inputs.title.value )
      // formdata.append('description',formState.inputs.description.value )
      // formdata.append('image',formState.inputs.image.value )
let responseData;
    try{
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('image', formState.inputs.image.value);
      responseData=formData;
     responseData= await sendRequest(  `${process.env.REACT_APP_URL}/places/${placeId}`,
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
   
      history.push('/'+ auth.userId +'/places')
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
    if (!LoadedPlace && !error) {
      return (
        <div className="center">
          <h2>Could not find place!</h2>
        </div>
      );
    }
  
   
  
    return (
      <React.Fragment>
        <ErrorModal error={error} Onclear={clearerror}/>
   {!isLoading && LoadedPlace && (
      <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          initialValue={LoadedPlace.title}
          initialValid={true}
        />
      {!isLoading && LoadedPlace && <ImageUpload center id="image" onInput={inputHandler}/>}
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (min. 5 characters)."
          onInput={inputHandler}
          initialValue={LoadedPlace.description}
          initialValid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>)}
      </React.Fragment>
    );
  };
  export default UpdatePlace;