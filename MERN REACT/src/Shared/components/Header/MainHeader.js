import React  from 'react';
import './MainHeader.css';


const mainheader=(props)=>{


return (
    <header className='main-header'>
        {props.children}
        </header>
  
  );


}

export default mainheader;