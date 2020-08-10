import React from 'react';
import './home.styles.scss';
import Button from '../../components/button/button.component';

import {address, abi} from '../../storehash';
import Web3 from 'web3';
import ipfs from '../../ipfs';
import storehash from '../../storehash';

class Home extends React.Component {
   constructor() {
      super();
      this.state = {
        account: '',
        smart_contract: '',
        contract_address: '',
        ipfsHash : null,
        buffer: '',
        transactionHash: '',
        blockNumber: '',
        gasUsed:'',
        txReceipt: ''  
      };
    }

    captureFile =(event) => {
      event.stopPropagation()
      event.preventDefault()
      const file = event.target.files[0]
      let reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => this.convertToBuffer(reader)    
    };

    convertToBuffer = async(reader) => {
      //file is converted to a buffer to prepare for uploading to IPFS
        const buffer = await Buffer.from(reader.result);
      //set this buffer -using es6 syntax
        this.setState({buffer});
    };

    onClick = async () => {

      try{
          this.setState({blockNumber: "waiting.."});
          this.setState({gasUsed: "waiting..."});
         
          const web3 = new Web3(Web3.givenProvider); // Provider from Metamask
          
          // get Transaction Receipt in console on click
          await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=> {
            console.log(err,txReceipt);
            this.setState({txReceipt});
            //this.setState({blockNumber: txReceipt.blockNumber});
            //this.setState({gasUsed: txReceipt.gasUsed}); 
          });    
        } 

      catch(error){
          console.log(error);
        } 
    } 

   onSubmit = async (event) => {
      event.preventDefault();

      const web3 = new Web3(Web3.givenProvider); // Provider from Metamask
  
      // Get users metamask account address
      const accounts = await web3.eth.getAccounts(); 
      this.setState({account: accounts[0]});
      console.log('Current Metamask account: ', accounts[0]);
  
      // Get Contract address from storehash.js
      const smart_contract = new web3.eth.Contract(abi, address);
      this.setState({smart_contract: smart_contract,
         contract_address: smart_contract.options.address
      });
      console.log('The contract address is : ', smart_contract.options.address);

      //save document to IPFS,return its hash, and set hash to state
      try{
         await ipfs.add(this.state.buffer, (err,ipfsHash) => {
            console.log(err,ipfsHash);
            this.setState({ ipfsHash: ipfsHash[0].hash });

            // call Ethereum method-sendHash to send this ipfs hash to ethereum contract
            // retrun transaction hash from ethereum

            storehash.methods.sendHash(this.state.ipfsHash).send({
               from: accounts[0] 
            }, (error, transactionHash) => {   // Transaction Hash!
                  console.log(error,'Transaction Hash is: ',  transactionHash);
                  this.setState({transactionHash});
               }
            ); 

         });
      } catch(error) {
         console.log(error);
      }
   }

   render() {
      return (
         <section className = "home">
            <span className = "home_title">HOME PAGE</span>

            <form className = "form_upload" onSubmit={this.onSubmit}>
               <input 
                  type = "file"
                  onChange = {this.captureFile}
                  className = 'form-input'
               />

               <Button title = "Upload" type = "submit" />
            </form>

            <Button title = "GET TX INFO" onClick = {this.onClick} />

         </section>
      );
   }
};

export default Home;