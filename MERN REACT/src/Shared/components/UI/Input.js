import React ,{useReducer ,useEffect} from 'react';
import { validate } from './Validators';
import './Input.css';


const InputReducer=(state,action)=>{
    switch (action.type){
    case "Change":
    return{
        ...state,
        value:action.val,
        isValid: validate(action.val, action.validators)

    }
    case 'Touch': {
        return {
          ...state,
          isTouched: true
        }}
    default:
        return state;
    };
};

const Input =(props)=>{
    const [inputState,dispatch]= useReducer(InputReducer,{value:props.initialValue||'', 
     isTouched: false,
      Valid:props.initialValid|| false})  


    const {id,onInput}=props
const {value,isValid}=inputState


useEffect(()=>{
onInput(id,value,isValid)
}
    ,[id,value,isValid,onInput])


    
const ChangeHandler=(event)=>{
    dispatch({type:'Change',
     val:event.target.value , 
     validators: props.validators}
     )
}
const TouchHandler=()=>{
  dispatch({  type:'Touch'
})}

  const element=
props.element == 'input' ? (
    <input id={props.id}
     type={props.type} 
     placeholder={props.placeholder}
     onChange={ChangeHandler}
     value={inputState.value}
     onBlur={TouchHandler}
     />
):(
<textarea id={props.id}
 rows={props.rows || 3}  
 onChange={ChangeHandler}
 value={inputState.value}
 onBlur={TouchHandler}/>
);
      return(
           <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
      <label >{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorMessage}</p>}
               </div> )
    }


export default Input;