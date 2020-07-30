import React from 'react';
import './form.styles.scss';

const FormInput = ({handleChange, label, ...otherProps}) => (
   <div className="group">
      <input className="form" onChange = {handleChange} {...otherProps}/>
      {
         label ?
         (<label className ={`${otherProps.value.length ? 'shrink': ''} form-input-label`}> 
            {label}
         </label>)
         :null      
      }
</div>
);

export default FormInput;