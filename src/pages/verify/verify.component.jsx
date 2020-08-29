import React, { useState } from "react";
//import web3 from "../../web3";
import storehash from '../../storehash';

import Button from '../../components/button/button.component';
import './verify.styles.scss';

import FormInput from '../../components/form/form.component';

const Verify = () => {
   const [isValid, setIsValid] = useState("valid, invalid");
   const [messageHash, setMessageHash] = useState("");
   const [signHash, setSignHash] = useState("");
   const [result, setResult] = useState("");
   const [ipfsHash, setIpfsHash] = useState("");

   const handleMessageChange = event => {
      const {value} = event.target;
      setMessageHash(value);
   }

   const handleSignChange = event => {
      const {value} = event.target;
      setSignHash(value);
   }
  
   // Recover the issuer's ethereum address 
   const onSubmit = async(event) => {
      event.preventDefault();
      try{
         const result = await storehash.methods.recover(messageHash, signHash).call();
         console.log(result);
         setResult(result);
         setIsValid("valid");

         // get the Ipfs hash
         const ipfsHash = await storehash.methods.getHash().call();
         setIpfsHash(ipfsHash);
         console.log(ipfsHash); 

      }
      catch(err) {
         setIsValid("invalid");
         console.log(err);
      }
   }      

   return(   
      <section className = "verify">
         <div>VERIFY PAGE</div>

         <form onSubmit = {onSubmit}>
            <FormInput 
               name = "message"
               type = "message"
               value = {messageHash}
               handleChange = {handleMessageChange}
               label = "Enter Message"
               required
            />

            <FormInput 
               name = "sign"
               type = "sign"
               value = {signHash}
               handleChange = {handleSignChange}
               label = "Enter Signature"
               required
            />

            <Button title = "Verify" type = "submit" onClick = {onSubmit} />
         </form>

         {
            result || isValid === "valid" ?
               <span className = "verify-result">Signed by: {result}</span>
            :   
            isValid === "invalid" ?            
               <span className = "verify-result">Message and signature do not match!</span>
            :
               null
         }

         {
            ipfsHash ?
            <img className = "verify-ipfs-image" 
               src = {"https://ipfs.io/ipfs/"+ ipfsHash} 
               alt = "No preview available" 
            />
            :
            null
         }

      </section>  
   );
}

export default Verify;
