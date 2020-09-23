import React from 'react';
import './guide.styles.scss';
import {motion} from 'framer-motion';
import Diagram from '../../components/images/Diagram.png';

const Guide = () => {
   return(
      <section className = "guide">
         <motion.div initial={{ opacity:  0 }} animate={{opacity: 1 }} transition={{ opacity: { duration: 0.6 } }} exit={{ opacity: 0 }}>
         <h1 className = "guide-title">About BlockDVS </h1>
            <div className = "guide-intro">
               <p className = "guide-p">
                  BlockDVS is a platform to issue and verify official documents based on the blockchain technology.
                  These official documents refer to academic certificates, civic records, professional licenses, workforce development, and much more. What sets BlockDVS apart is its fully decentralized feature.
                  
               </p>
               <p className = "guide-p">
                  Official records issued by the organizations or institutions are stored in IPFS(Interplanetary File System) and 
                  also in the Etherem blockchain, which provides ultimate security through immutability and transparency.
               </p>
               <p className = "guide-p">
                  BlockDVS uses asymmetric cryptography; a message is created by private-key encryption and
                  a digital signature is issued by the organization, which are then provided to the recepients.
                  This message and signature can then be verified by any peer in the Etherem network provided they have the public key of the issuer.
                  Verifications can also be made by determining the isseur's Ethereum address via the transaction hash.
               </p>
            </div>
         
            <h1 className = "guide-title">Here's how it works </h1>
            
            <div className = "guide-diagram">
               <p className = "guide-p">
                  The core features and functionalities of BlockDVS is represented by the flow diagram below:       
               </p>
               <img src = {Diagram} className = "guide-diagram-image" alt = "No preview available"></img>
            </div>
         </motion.div>
      </section>
   );
}

export default Guide;