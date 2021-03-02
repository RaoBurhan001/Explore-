import React, { useEffect, useState } from 'react';
import './UserPlaces.css';
import  PlaceList from'../components/PlacesList';
import image from '../../Shared/Pictures/Pic 1.jpg'
import { useParams } from'react-router-dom';
import { useHttpClient } from '../../Shared/hooks/http-hook';
import ErrorModal from '../../Shared/components/UI/ErrorModal';
import Spinner from '../../Shared/components/UI/LoadingSpinner';

const UserPlaces =(props)=>{
  
 const [LoadedPlace , setLoadedPlace] = useState()
  const{isLoading,clearerror,sendRequest,error}= useHttpClient();
    const userID= useParams().userId;
    useEffect(()=>{
      const fetch = async()=>{
       try{ 
         const responseData =await sendRequest(`${process.env.REACT_APP_URL}/places/user/${userID}`)
          setLoadedPlace(responseData.places)
      }catch(err){console.log(err.message)}
    };
      fetch();
    },[sendRequest,userID])
    
    const DeletePlaceHandler=(deleteid)=>{
      setLoadedPlace(prevPlaces=>prevPlaces.filter(place=> place.id !== deleteid))
    }
        return (
          <React.Fragment>
            <ErrorModal error={error} onClear={clearerror}/>
            {isLoading && (<div className='center'>
              <Spinner/>
              </div>)
              }
{!isLoading && LoadedPlace && <PlaceList items={LoadedPlace} DeletePlace={DeletePlaceHandler}/>}
</React.Fragment>)
    }


export default UserPlaces;