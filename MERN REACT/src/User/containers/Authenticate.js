import React, { useState, useContext } from'react';
import './Authentication.css';
import {useForm} from '../../Shared/hooks/form-hook';
import {VALIDATOR_MINLENGTH , VALIDATOR_REQUIRE, VALIDATOR_EMAIL} from '../../Shared/components/UI/Validators';
import Button from '../../Shared/components/UI/Button';
import Input from '../../Shared/components/UI/Input';
import Card from '../../Shared/components/UI/Card';
import ErrorModal from'../../Shared/components/UI/ErrorModal';
import LoadingSpinner from'../../Shared/components/UI/LoadingSpinner';
import { useHttpClient } from '../../Shared/hooks/http-hook';
import {AuthContext} from '../../Shared/Context/auth-context';
import ImageUpload from'../../Shared/components/UI/ImageUpload';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          },
          image:{
            value:null,
            isValid:false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_URL +'/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        console.log(responseData)
        auth.login(responseData.userId, responseData.token);
      } catch (err) {console.log(err.message)}
    } else {
      try {
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);
        const responseData = await sendRequest(
          process.env.REACT_APP_URL + '/users/signup',
          'POST',
          formData
        );
   console.log(responseData)
   console.log(responseData.userId)
        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        
        console.log(err)
       
      }
    
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          { !isLoginMode && <ImageUpload center id="image" onInput={inputHandler} />} 
          {/* //as the onInput function's inputs are same for file as well  */}
       
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 5 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
