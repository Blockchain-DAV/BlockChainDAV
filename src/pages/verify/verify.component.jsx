import React, { useState } from "react";
import web3 from "../../web3";

import Button from '../../components/button/button.component';
import './verify.styles.scss';


const Verify = ({txReceipt}) => {
   const [isValid, setIsValid] = useState(false);

   // mine block and verify transaction of requester
   const onClick = async() => {
      /*let block = await web3.eth.getBlock(txReceipt.blockNumber);
      console.log(block);*/
      try{
      let tx = await web3.eth.getTransaction(txReceipt.transactionHash);
         if (tx) {
            setIsValid(true);
         }
         console.log('transaction', tx);
      }
      catch(err) {
         console.log(err);
      }
   }      

   return(   
   // create a form for requester to enter their transaction receipt
      <section className = "verify">
         <div>VERIFY PAGE</div>
         <div className = "verify-button">
            <Button title = "Verify" onClick = {onClick} />
         </div>
         {
            isValid ?
            <span className = "verify-result">Your transaction is valid!</span>
            :
            null
         }
      </section>  
   );
}

export default Verify;
