import React, { useState } from "react";

import web3 from "../../web3";
import {abi} from '../../storehash';
//import storehash from '../../storehash';
import storehash_verifier from '../../storehash_verifier';

import './verify.styles.scss';
import { Form, Input, Button} from "antd";
import {motion} from 'framer-motion';

const Verify = () => {
   const [form] = Form.useForm();
   const [contractAddress, setContractAddress] = useState("");
   const [messageHash, setMessageHash] = useState("");
   const [issuerAddress, setIssuerAddress] = useState("");
   const [signHash, setSignHash] = useState("");
   const [result, setResult] = useState("");
   const [ipfsHash, setIpfsHash] = useState("");
   const [valid, setValid] = useState("");

   const handleConAddressChange = event => {
      const {value} = event.target;
      setContractAddress(value);
   }

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

   // ContractAddress needed, then call the contract's getHash method 
   const onAddressSubmit = async() => {
      if (contractAddress) {
         const storehash = new web3.eth.Contract(abi, contractAddress);
         const ipfs = await storehash.methods.getHash().call();
         setIpfsHash(ipfs);
         console.log(ipfsHash);
      }
      else {
         alert("Please fill out the contract address");
      }
      
   }
   
   // Recover the issuer's ethereum address + Verify document
   const onSubmit = async(event) => {
      event.preventDefault();
      if (!contractAddress){
         alert("Please view the document first!");
      }
      else{
         if (!messageHash || !signHash || !issuerAddress) alert("Please fill in all the fields");
         try{
            const storehash = new web3.eth.Contract(abi, contractAddress);
            const result = await storehash.methods.recover(messageHash, signHash).call();
            setResult(result);
   
            if (result === issuerAddress) {
   
               // IPFS hash obtained from the contract address submission must be 
               // hashed with SHA3 to get a message
               // basically create the verifier's version of message and compare with given messageHash
               // if equal then valid!
   
               if (ipfsHash) {
                  const message = web3.utils.sha3(ipfsHash); 
                  if (message === messageHash){
                     setValid("true");
                     console.log('Signature is Valid');
                  }
                  else setValid("false");
               }
               
            }
            else {
               setValid("false");
               console.log('Signature is Invalid');
            }
    
         }
         catch(err) {
            setValid("false");
            console.log(err);
         }
      } 
   }

   const sendTX = async() => {
      const accounts = await web3.eth.getAccounts();
      try {
         storehash_verifier.methods.sendAddress(accounts[0]).send(
            {
               from: accounts[0],
            }, (error,transactionHash) => {
               console.log(error, transactionHash);
            }
         );

      //const a = await storehash_verifier.methods.getAddress().call();
/*
        const message = web3.utils.sha3("Valid"); 
        console.log("Encrypted IPFS hash(message) = ", message);
        
        // create digital signature of verifier
        try {
            web3.eth.sign(message, accounts[0],
            (err, signature) => {
                console.log("signature = ", signature);                           
               });
         }        
         catch(err){
               console.log(err);
               alert("Please log into your Metamask Account!");
         }
        */
      } catch(error) {
         console.log(error);
      }
   }

   return(   
         <section className = "verify">
            <motion.div initial={{ opacity:  0 }} animate={{opacity: 1 }} transition={{ opacity: { duration: 0.6 } }} exit={{ opacity: 0 }}>
               <h1 className = "verify-title"> Verify Documents </h1>
               <div className = "verify-view">
                  <p>
                     View and verify the document hosted by IPFS by providing the address of smart contract deployed by the issuer.
                  </p>
               </div>
               <div className = "verify-form-div">
                  <Form form={form} layout="vertical" className = "verify-form-0">
                     <Form.Item label="Contract Address" name="con_address" rules={[{ required: true }]}>
                        <Input placeholder="Enter Contract Address" onChange = {handleConAddressChange} />
                     </Form.Item>
                  </Form>
                  <Button className = "verify-ipfs-button" onClick = {onAddressSubmit}>
                     {
                        ipfsHash ? 
                           <a href = {"https://ipfs.io/ipfs/"+ipfsHash} 
                              target = "_blank" rel="noopener noreferrer" className = "verify-ipfs-button-link">
                              View Document
                           </a>
                        :<button className = "temp_button">
                           View Document
                        </button>
                     }   
                  </Button>
               </div>

               <div className = "verify-form-div">
                  <Form form={form} layout="vertical" className = "verify-form">
                     <Form.Item label="Message" name="message" rules={[{ required: true }]}>
                        <Input placeholder="Enter message" onChange = {handleMessageChange} />
                     </Form.Item>
                     <Form.Item label="Signature" name="signature" rules={[{ required: true }]}>
                        <Input placeholder="Enter Signature" onChange = {handleSignChange} />
                     </Form.Item>
                     <Form.Item label="Issuer's public key" name="address" rules={[{ required: true }]}>
                        <Input placeholder="Enter Issuer's public key" onChange = {handleAddressChange} />
                     </Form.Item>
                     
                  </Form>
                  <button key="submit" onClick={onSubmit} className = "verify-ipfs-button">
                        Verify
                  </button>
                  
                  <div className = "verify-result">
                     {
                     valid === "true" ?
                           <div className = "verify-result-valid-div">
                              <span className = "verify-result-valid">This Document is Valid.</span>
                              <br></br>
                              <button className = "verify-result-contract" onClick = {sendTX}>
                                 Save Transaction
                              </button>
                           </div>
                        :
                        valid === "false" ?
                        <span className = "verify-result-invalid">
                           This Document is Invalid.
                        </span>
                        :
                        null
                     }
                  </div>
               </div>   
            </motion.div>
         </section>  
   );
}

export default Verify;
