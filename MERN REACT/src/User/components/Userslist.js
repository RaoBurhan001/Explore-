import React  from 'react';
import Useritem from'./Useritem';
import './Userslist.css';
const userslist=(props)=>{

if(props.items.length === 0)
{
    return <h3>No Users Found</h3>
}
return (
    
    <ul className="users-list">
      {props.items.map(user => (
        <Useritem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );


}

export default userslist;