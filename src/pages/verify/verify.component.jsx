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
               console.log(transactionHash);
            }
         );

      } catch(error) {
         console.log(error);
      }
   }

   return(   
         <section className = "verify">
            <motion.div initial={{ opacity:  0 }} animate={{opacity: 1 }} transition={{ opacity: { duration: 0.6 } }} exit={{ opacity: 0 }}>
               <h1 className = "verify-title"> Verify Documents </h1>
               <div className = "verify-desc">
                  <p>
                     BlockDVS allows two verification processes. After you view the file hosted
                     by IPFS, you can either verify a document by entering the message and signature along
                     with the issuer's public key. Alternatively, you can verify the document by entering Tx Hash or Block Number 
                     on Rinkey Testnet Explorer.
                  </p>
               </div>

               <div className = "verify-view">
                  <h1 className = "verify-title">Verify through Digital Signature </h1>
                     <center>
                        <p className = "verify-view-p">
                        First, enter the contract address to view the document hosted by IPFS.
                        </p>
                     </center>
               </div>
               <div className = "verify-form-div">
                  <Form form={form} layout="vertical" className = "verify-form-0">
                     <Form.Item label="Smart Contract Address" name="con_address" rules={[{ required: true }]}>
                        <Input placeholder="Enter Smart Contract Address" onChange = {handleConAddressChange} />
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

               <div className = "verify-form-div-2">

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

               <div className = "verify_altr">
                  <h1 className = "verify-title"> Alternative Verification </h1>
                  <p>
                     Alternatively, you can verify the issuer's address by searching for the 
                     transaction hash or block number on the Rinkey TestNet Explorer.
                     <a className = "upload-content-0-link" href = "https://www.rinkeby.io/#explorer" target = "_blank" rel="noopener noreferrer">
                     &nbsp; Click here.   
                     </a>
                  </p>
               </div>
            </motion.div>
         </section>  
   );
}

export default Verify;
