import React , {useCallback,useEffect,useState } from 'react';
import { Redirect } from 'react-router';


let logoutTimer;
 export const useAuth=()=>{
    const[token,setToken] =useState(false)
 const [TokenExpiration, setTokenExpiration]= useState(null)
 const[userId, setUserId] =useState(false);


 const login=useCallback((uid , token , expirationTime)=>{
   console.log("LOGIN")
   console.log(token)
   const tokenExpirationTime =expirationTime ||  new Date(new Date().getTime()+ 1000 *60 *60 )  //current date + 1 hour 
   setTokenExpiration(tokenExpirationTime)
   setToken(token)
   setUserId(uid);
   localStorage.setItem(
    'userData',
    JSON.stringify({ userId: uid, token: token, expirationTime: tokenExpirationTime.toISOString() })// to ISOString is use to conver it the time into string and it is reversible unlike toString()
                                                                                                    
  );
 },[])


 const logout=useCallback(()=>{
   console.log("LOG OUT")
   
  setToken(null)
  setTokenExpiration(null)
  setUserId(null)
 
  localStorage.removeItem('userData')
},[])

useEffect(()=>{
  const storedData = JSON.parse(localStorage.getItem('userData')) //JSON.parse will convert the JSON format data into object
  if(storedData && storedData.token && new Date(storedData.expirationTime) > new Date())
  {
    login(storedData.userId, storedData.token , new Date(storedData.expirationTime));
  }
 },[login])
 
useEffect(()=>{

  if(token  && TokenExpiration)
  {
    const remaining = TokenExpiration.getTime() - new Date().getTime();
    logoutTimer=setTimeout(logout,remaining);
  }
  else{
    clearTimeout(logoutTimer)
  }
},[logout, TokenExpiration,token])

return {login , logout , token , userId}
}