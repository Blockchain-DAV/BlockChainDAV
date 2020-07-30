import React from 'react';
import './login.styles.scss';
import FormInput from '../../components/form/form.component';
import Button from '../../components/button/button.component';

class Login extends React.Component {
   constructor() {
      super();

      this.state = {
         email : '',
         password: ''
      }
   }

   handleSubmit = event => {
      event.preventDefault();
      alert('Login attempted');
      this.setState({email: '', password: ''})
   }

   handleChange = event => {
      const {name, value} = event.target;
      this.setState({[name]: value})
   }

   render() {
      return(
         <section className = 'login'>
            LOGIN PAGE

            <form onSubmit = {this.handleSubmit}>
               <FormInput 
                  name = "email"
                  type = "email"
                  value = {this.state.email}
                  handleChange = {this.handleChange}
                  label = "email"
                  required
               />

               <FormInput 
                  name = "password"
                  type = "password"
                  value = {this.state.password}
                  handleChange = {this.handleChange}
                  label = "password"
                  required
               />
               
               <Button title = "log in" type = "submit"/>
            </form>
         </section>
      );
   }

}

export default Login;