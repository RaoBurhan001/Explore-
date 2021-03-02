import React from 'react';
import { BrowserRouter , Route, Redirect, Switch } from 'react-router-dom';
import User from'./User/containers/User';
import Place from'./Places/containers/Newplace';
import MainNavigation from './Shared/components/Header/MainNavigation';
import UserPlaces from'./Places/containers/UserPlaces';
import UpdatePlace from'./Places/containers/UpdatePlace';
import UpdateProfile from './User/containers/UpdateUser';
import Authenticate from'./User/containers/Authenticate';
import {AuthContext} from './Shared/Context/auth-context';
import {useAuth} from './Shared/hooks/Auth-hook';
import './App.css';



const App =()=>{
  const {login ,logout , userId,  token}  = useAuth();
let routes

if(token)
{
  routes=(
<Switch>
<Route path='/'  exact component={User}/>
        
 <Route path='/:userId/places' exact component={UserPlaces}/>
 <Route path='/places/new' exact component={Place}/>
 <Route path='/places/:placeId' component={UpdatePlace}/>
 <Route path = '/users/:userId/edit' exact component={UpdateProfile} />

 <Redirect to ='/'/>
 </Switch>
 )
}
else{
 routes=(
    
<Switch>
<Route path='/'  exact component={User}/>
        
 <Route path='/:userId/places' exact component={UserPlaces}/>
 <Route path='/auth' component={Authenticate}/>
 <Redirect to='/auth'/>
</Switch>
  )
}
    return (
      <AuthContext.Provider value={{isLoggedin:!!token , token:token, userId:userId , login:login , logout:logout}}>
        
       <BrowserRouter>
       <MainNavigation/>
       <main>
      {routes}
        </main>
        </BrowserRouter>
        </AuthContext.Provider>
     
    );
  }


export default App;
