import React ,{ useContext} from 'react';
import { useHistory } from 'react-router-dom';
import {useForm} from '../../Shared/hooks/form-hook';
import './Newplace.css';
import Input from '../../Shared/components/UI/Input';
import Errormodal from '../../Shared/components/UI/ErrorModal';
import LoadingSpinner from '../../Shared/components/UI/LoadingSpinner';
import Button from '../../Shared/components/UI/Button';
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from'../../Shared/components/UI/Validators';
import {useHttpClient} from '../../Shared/hooks/http-hook';
import { AuthContext } from '../../Shared/Context/auth-context'; 
import ImageUpload from '../../Shared/components/UI/ImageUpload';
const Place=()=> {
  const auth = useContext(AuthContext);  //listener to our auth context
const {isLoading , isError, clearError,sendRequest}= useHttpClient();
    const [formstate, inputHandler] = useForm(
        {
          title: {
            value: '',
            isValid: false
          },
          description: {
            value: '',
            isValid: false
          },
          address: {
            value: '',
            isValid: false
          },
          image:{
            value: null,
            isValid: false
          }
        },
        false
      );

      const history = useHistory();

      const SubmitFormHandler = async event => {
        event.preventDefault();
        try {
          const formData = new FormData();
          formData.append('title', formstate.inputs.title.value);
          formData.append('description', formstate.inputs.description.value);
          formData.append('address', formstate.inputs.address.value);
          formData.append('creator', auth.userId);
          formData.append('image',formstate.inputs.image.value)
        //  formData.append('image', formState.inputs.image.value);
          await sendRequest(process.env.REACT_APP_URL + '/places', 'POST', formData,
          {
          Authorization: 'Bearer '+ auth.token
       
          }
        
          // JSON.stringify({
          //   title: formstate.inputs.title.value,
          //   description: formstate.inputs.description.value,
          //   address: formstate.inputs.address.value,
          //   creator: auth.userId
          );
    
          console.log(auth.userId)
          history.push('/');
        }catch (err) {
          console.log(err);
          console.log(err.message)}
      };

        return(
          <React.Fragment>
            <Errormodal error={isError} clear={clearError}/>
            
            <form className='place-form' onSubmit= {SubmitFormHandler}>
              {isLoading && <LoadingSpinner asOverlay/>}
            <Input 
            id='title'
            element='input' 
            type='text' 
            label='Title'
            errorMessage="Please Enter a valid Title"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            />
            
            <Input 
            id='description'
            element='textarea' 
            type='text' 
            label='Description'
            errorMessage="Please Enter a valid Description ( 5 characters minimum)"
            validators={[VALIDATOR_MINLENGTH(5)]}
            onInput={inputHandler}
            />
            <ImageUpload center id="image" onInput={inputHandler}/>
             <Input 
            id='address'
            element='input' 
            type='text' 
            label='Address'
            errorMessage="Please Enter a valid Address"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            />
            <Button  type='submit' disabled = { ! formstate.isValid}> ADD PLACE </Button>
              
            </form>
            </React.Fragment>
            )
    }


export default Place;