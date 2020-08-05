import React from 'react';
import './button.styles.scss';

const Button = ({title, onClick }) => (
   <div className = 'button-div'>
      { title? 
         <button className = 'button' onClick={onClick}>
            {title}
         </button>
         :
         null
      }
   </div>
   
);

export default Button;