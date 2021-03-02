import React ,{useRef ,useEffect} from 'react';
import './Map.css';

const Map=(props)=>{

    const mapRef=useRef();
const {center , zoom}=props// pulling the elements out of the props
    //use effect is use instead of Component did mount as the Reference was not passed to the <div ref

useEffect(()=>{
  
    const map= new window.google.maps.Map(mapRef.current,{
        center: center,
        zoom:zoom
    })
    new window.google.maps.Marker({position:center , map:map});
},[center,zoom])


    




   return ( <div ref={mapRef} className ={`map ${props.className}`} style={props.style}>



    </div>
   )}

export default Map;

//By using useRef we pass the map pointer to div 