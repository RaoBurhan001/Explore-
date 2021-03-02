import React, { useEffect, useState } from 'react';
import UserLists from '../components/Userslist';
import Spinner from '../../Shared/components/UI/LoadingSpinner';
import ErrorModal from'../../Shared/components/UI/ErrorModal';
 import { useHttpClient} from '../../Shared/hooks/http-hook';
const User =()=>{
    const {isLoading , isError , sendRequest, clearerror}= useHttpClient()
const [LoadedUser,setLoadedUser]=useState()


    useEffect(()=>{
        const fetchUsers = async()=>{
           
            try{
               
          const responseData = await sendRequest(process.env.REACT_APP_URL +'/users/')  //it will send a get request
        
          setLoadedUser(responseData.users);
         
            }
            catch(err)
            {
            }
           };
        fetchUsers();
    },[sendRequest])  //as it is coming from outside the function
    
        return(
            <React.Fragment>
         <ErrorModal error={isError} onClear={clearerror}/>
         {isLoading && ( <div className='center'><Spinner/></div>)}

        {!isLoading && LoadedUser&& <UserLists items={LoadedUser}/>}
                </React.Fragment>
        )
    }


export default User;