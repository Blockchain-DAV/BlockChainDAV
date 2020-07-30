import React from 'react';
import './button.styles.scss';

const Button = ({title}) => (
   <div className = 'button-div'>
      { title? 
         <button className = 'button'>
            {title}
         </button>
         :
         null
      }
   </div>
   
);

export default Button;