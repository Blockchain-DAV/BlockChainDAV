import React, { useState } from "react";
//import web3 from "../../web3";
import storehash from '../../storehash';

import Button from '../button/button.component';
import './verify.styles.scss';

import FormInput from '../form/form.component';

const Verify = () => {
   const [messageHash, setMessageHash] = useState("");
   const [issuerAddress, setIssuerAddress] = useState("");
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

   const handleAddressChange = event => {
      const {value} = event.target;
      setIssuerAddress(value);
   }
  
   // Recover the issuer's ethereum address 
   const onSubmit = async(event) => {
      event.preventDefault();
      try{
         const result = await storehash.methods.recover(messageHash, signHash).call();
         setResult(result);
         
         if (result === issuerAddress) {
            // VERIFICATION LOGIC
         }
 
      }
      catch(err) {
         console.log(err);
      }
   }      

   return(   
      <section className = "verify">
         <form onSubmit = {onSubmit}>
            <FormInput 
               name = "message"
               type = "message"
               value = {messageHash}
               handleChange = {handleMessageChange}
               label = "Message"
               required
            />

            <FormInput 
               name = "sign"
               type = "sign"
               value = {signHash}
               handleChange = {handleSignChange}
               label = "Signature"
               required
            />

            <FormInput 
               name = "address"
               type = "address"
               value = {issuerAddress}
               handleChange = {handleAddressChange}
               label = "Issuer's public key"
               required
            />
            <Button title = "Verify Document" type = "submit" onClick = {onSubmit} />
         </form>

         {
            // VERIFICATION LOGIC HERE
         }

         {/* { 
            ipfsHash ?
            <img className = "verify-ipfs-image" 
               src = {"https://ipfs.io/ipfs/"+ ipfsHash} 
               alt = "No preview available" 
            />
            :
            null
         } */}

      </section>  
   );
}

export default Verify;
