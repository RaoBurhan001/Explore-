import React from 'react';
import './PlacesList.css';
import PlaceItem from './PlacesItem';
import Card from '../../Shared/components/UI/Card';
import Button from'../../Shared/components/UI/Button';
const placeslist =(props)=>{

if(props.items.length ===0)
{
    return (
        <Card className="place-list center">
            <h1 style={{color: 'black' , margin:'10px'}}>  No Places Found </h1>
        
         <Button  to='/places/new'> Share </Button>
       
        </Card>
    )
}

return (
    <ul className="place-list">
      {props.items.map(place => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete= {props.DeletePlace}
        />
      ))}
    </ul>
  );
}

export default placeslist;