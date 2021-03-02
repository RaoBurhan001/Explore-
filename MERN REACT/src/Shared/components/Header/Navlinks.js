import React  from 'react';
import { NavLink ,Link } from 'react-router-dom';
import './NavLinks.css';
import {AuthContext} from '../../Context/auth-context'
import { useContext } from 'react';

const NavLinks=(props)=>{

const auth = useContext(AuthContext)
    
return (
    <React.Fragment>
    {/* <ul className='nav-links '>
           <NavLink  to='/' > EXPLORE </NavLink>
        </h1> */}
   <ul className='nav-links'>
   <li>
           <h3>EXPLORE</h3>
       </li>
       <li>
           <NavLink to='/' exact >ALL USERS</NavLink>
       </li>
       {auth.isLoggedin &&(
       <li>
           <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
       </li>
       )}
       {auth.isLoggedin && (
       <li>
           <NavLink to='/places/new'>ADD PLACE</NavLink>
       </li>
       )}
       {!auth.isLoggedin&&(
       <li>
           <NavLink to='/auth'>AUTHENTICATE</NavLink>
       </li>
     )}
     {/* {auth.isLoggedin && (

    <li>
        <NavLink to ={`/users/${auth.userId}/edit`}>EDIT PROFILE</NavLink>
    </li>
     )
     } */}

     {auth.isLoggedin &&(
<li>
      <button onClick={auth.logout}>LOG OUT</button>
</li>
     )}
   </ul>
   </React.Fragment>
  );


}

export default NavLinks;