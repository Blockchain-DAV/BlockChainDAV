import React, { useState } from "react";
import "./upload.styles.scss";
import { Form, Input, Upload, Modal, Button, notification } from "antd";
import emailjs from 'emailjs-com'

import { InboxOutlined, SmileOutlined } from "@ant-design/icons";
import web3 from "../../web3";
import ipfs from "../../ipfs";
import storehash from "../../storehash";
import {motion} from 'framer-motion';
import {address} from "../../storehash";

export const openNotification = () => {
    notification.open({
        message: "About Transaction Reciept",
        description: "You will be receiving transaction receipt shortly!",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
};

const UploadComponent = ({sendParams}) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    // state for recepient email
    const [email, setEmail] = useState('');

    //state for ipfs and smart contract
    const [buffer, setBuffer] = useState("");
    const [metamaskAccount, setMetamaskAccount] = useState(null);

    const [ipfsHash, setIpfsHash] = useState(null);
    const [transactionHash, setTransactionHash] = useState(null);

    // state for the message (encrypted IPFS hash) and signature
    const [message, setMessage] = useState(null);
    const [signature, setSignature] = useState(null);

    //loading states
    const [transactionReceipt, setTransactionReceipt] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true);

    //modal states
    const [visible, setVisible] = useState(false);

    const props = {
        onRemove: file => {
            setFileList(fileList => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                return newFileList;
            });
        },
        beforeUpload: file => {
            setFileList(() => [file]);
            form.setFields([
                {
                    name: "dragger",
                    errors: [],
                },
            ]);
            return false;
        },
        fileList,
    };

    const convertToBuffer = async reader => {
        //file is converted to a buffer to prepare for uploading to IPFS
        const buffer = await Buffer.from(reader.result);
        //set this buffer -using es6 syntax
        setBuffer(buffer);
        return buffer;
    };

    const onTransactionReceiptClick = async () => {
        try {
            if (!transactionHash) {
                console.log("No transaction Hash provided");
                return;
            }

            // get Transaction Receipt in console on click
            await web3.eth.getTransactionReceipt(transactionHash, (err, txReceipt) => {
                setVisible(true);
                if (txReceipt !== null) {
                    setIsDisabled(false);

                    // Add contractAddress, message and signature to txReceipt
                    txReceipt.contractAddress = address;
                    txReceipt.message = message;
                    txReceipt.signature = signature;
                    console.log("TxReceipt = ", txReceipt);

                    setTransactionReceipt(txReceipt);
                    sendParams(txReceipt);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = e => {
        setEmail(e.target.value);
    }

    const sendEmail = async() => {
        if (email){
            if (transactionReceipt) {
                // Send Tx receipt with message + signature to recepient email
                const credentials = `BLOCK_HASH:${transactionReceipt.blockHash}----------
                                    BLOCK_NUMBER:${transactionReceipt.blockNumber}----------
                                    TX_HASH:${transactionReceipt.transactionHash}----------
                                    MESSAGE:${message}----------
                                    SIGNATURE:${signature}`;
    
                let templateParams = {
                    from_name: 'jason888maharjan@gmail.com', // issuer email
                    to_name: email, // recepient email
                    subject: 'Credentials for Document verification',
                    message_html: credentials
                }
    
                await emailjs.send (
                    'gmail',
                    'template_j247w8DU',
                    templateParams,
                    'user_1G9DdQcowYNKgYDuoQgt2'
                );
    
                alert("Credentials sent to recepient!")
            }
            else {
                alert("Please wait until the transaction is completed!")
            }
        }
        
        else {
            alert("Please Fill in the recepient email!");
        } 
    }
       
    const handleUpload = async (e) => {
        try {
            const isFileAvailable = fileList.length === 1;
            if (!isFileAvailable) {
                form.setFields([
                    {
                        name: "dragger",
                        errors: ["File is required"],
                    },
                ]);
            }

            await form.validateFields();

            if (isFileAvailable) {
                let reader = new window.FileReader();
                let _buffer;
                reader.readAsArrayBuffer(fileList[0]);
                reader.onloadend = async () => {
                    _buffer = await convertToBuffer(reader);
                };

                const accounts = await web3.eth.getAccounts();
                setMetamaskAccount(accounts[0]);

                // ipfs implementation
                // save document to IPFS, return its hash, and set hash to state
                await ipfs.add(_buffer, (err, ipfsHash) => {
                        setIpfsHash(ipfsHash[0].hash);
                        console.log("IPFS hash = ", ipfsHash[0].hash);
                        alert('File uploaded to IPFS!');
                });
            }

        } catch (error) {
            console.log(error);
        }
    };

    const signHash  = () => {
        // create message by encrypting the IPFS hash using SHA3
        const message = web3.utils.sha3(ipfsHash); 
        setMessage(message);
        console.log("Encrypted IPFS hash(message) = ", message);
        
        // create digital signature
        try {
            web3.eth.sign(message, metamaskAccount,
            (err, signature) => {
                setSignature(signature);
                console.log("signature = ", signature);
                
                // call Ethereum method-sendHash to send Ipfs hash to ethereum contract
                // return transaction hash from ethereum
                // send hash to recepient email
                storehash.methods.sendHash(ipfsHash).send(
                    {
                        from: metamaskAccount,
                    },
                    (error, transactionHash) => {
                        setTransactionHash(transactionHash);
                        console.log("TxHash = ", transactionHash);
                        setIsDisabled(false);
                        openNotification();
                    }
                );                           
            });
        }        
        catch(err){
            console.log(err);
            alert("Please log into your Metamask Account!");
        }
        
    }
    
    return (
        <section className="upload">
            <motion.div initial={{ opacity:  0 }} animate={{opacity: 1 }} transition={{ opacity: { duration: 0.6 } }} exit={{ opacity: 0 }}>
            <h1 className = "upload-title"> Getting Started </h1>
            <div className = "upload-content-0">
                <p>
                    The very first thing to do as an issuer is to create and deploy smart contract-which will cost some ether.
                    Note that this contract is immutable once deployed and will be transparent to all the peers in the network.
                </p>
                <p>
                    Create and deploy your smart contracts
                    <a href= 'http://remix.ethereum.org/' target = '_blank' rel = 'noopener noreferrer'
                     className = "upload-content-0-link">&nbsp;here.</a>
                </p>
            </div>
            <div className = "upload-content-1">

                {
                    !ipfsHash && !signature ?
                    <div className = "upload-content-1-form">
                        <h1 className = "upload-title"> Upload to IPFS </h1>
                        <Form form={form} layout="vertical" >
                            <Form.Item label="Dragger" name="dragger" rules={[{ required: true }]}>
                                <Upload.Dragger {...props}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                                </Upload.Dragger>
                            </Form.Item>
                            <Button key="submit" onClick={handleUpload} className = "upload-content-1-form-button">
                                Upload 
                            </Button>
                        </Form>
                    </div>
                    : ipfsHash && !signature ?
                    <div className = "upload-content-1-sign-perm">
                        <h1 className = "upload-title"> Create Digital Signature </h1>
                        IPFS Hash: {ipfsHash}
                        <br></br>
                        Sign this hash with your&nbsp;
                        <span className = "upload-content-1-sign-perm-link" onClick = {signHash}>
                            Metamask Account
                        </span>
                    </div>
                    :null
                }  

                {
                    signature ?
                    <div className = "upload-results">
                        <h1 className = "upload-title"> Send Credentials to Recepient </h1>
                        <strong>Message:</strong> {message}
                        <br></br><br></br>
                        <strong>Digital Signature:</strong> {signature}
                        <div className = "upload-results-form">
                            <Form form={form} layout="vertical" >
                                <Form.Item label="Recepient mail" name="mail" rules={[{ required: true }]}>
                                    <Input placeholder="email" onChange = {handleChange}/>
                                </Form.Item>
                                <Button key="submit" onClick={sendEmail}>
                                    Send to recepient
                                </Button>
                            </Form>
                        </div>
                    </div>
                    
                : null              
                }
            </div>

            <Modal
                visible={visible}
                title="Transaction Receipt"
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                footer={[
                    <Button key="submit" type="primary" onClick={() => setVisible(false)}>
                        Ok
                    </Button>,
                ]}
            >
                {transactionReceipt ? (
                    Object.entries(transactionReceipt)
                        .filter(entries => entries[0] !== "logs" && entries[0] !== "logsBloom")
                        .map((entries, i) => {
                            return (
                                <div key={i} className="table">
                                    <div className="key">{entries[0]}</div>
                                    <div className="value">
                                        {entries[1] ? entries[1] || "true" : "---"}
                                    </div>
                                </div>
                            );
                        })
                ) : (
                    <h4>Please wait till the transaction is Confirmed!</h4>
                )}
            </Modal>
            
            <span
                className={`float ${isDisabled ? "disable" : "animate"}`}
                onClick={isDisabled ? () => {} : () => onTransactionReceiptClick()}
            >
                <i className="far fa-file-alt my-float"></i>
            </span>
            </motion.div>
        </section>
    );
};

export default UploadComponent;
