import React from 'react';
import './guide.styles.scss';

const Guide = () => {
   return(
      <section className = "guide">
         <h1 className = "guide-title">About BlockDVS </h1>
            <div className = "guide-intro">
               <p>
                  BlockDVS is a platform to issue and verify official documents based on the blockchain technology.
                  These official documents refer to academic certificates, civic records, professional licenses, workforce development, and much more. What sets BlockDVS apart is its fully decentralized feature.
                  
               </p>
               <p>
                  Official records issued by the organizations or institutions are stored in IPFS(Interplanetary File System) and 
                  also in the Etherem blockchain, which provides ultimate security through immutability and transparency.
               </p>
               <p>
                  BlockDVS uses asymmetric cryptography; a message is created by private-key encryption and
                  a digital signature is issued by the organization, which are then provided to the recepients.
                  This message and signature can then be verified by any peer in the Etherem network provided they have the public key of the issuer.
               </p>
            </div>
         
            <h1 className = "guide-title">Here's how it works </h1>
         
      </section>
   );
}

export default Guide;