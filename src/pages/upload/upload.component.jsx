import React, { useState } from "react";
import "./upload.styles.scss";
import { Form, Input, Upload, Modal, Button, notification } from "antd";
// import Button from "../../components/button/button.component";
import { InboxOutlined, SmileOutlined } from "@ant-design/icons";
import { address, abi } from "../../storehash";
import web3 from "../../web3";
import ipfs from "../../ipfs";
import storehash from "../../storehash";

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

    //state for ipfs and smart contract
    const [buffer, setBuffer] = useState("");
    const [metamaskAccount, setMetamaskAccount] = useState(null);
    const [smartContract, setSmartContract] = useState(null);

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
                    setTransactionReceipt(txReceipt);
                    console.log("TxReceipt = ", txReceipt);
                    sendParams(txReceipt);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpload = async () => {
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

                // smart contract
                const smartContract = new web3.eth.Contract(abi, address);
                setSmartContract(smartContract);

                // ipfs implementation
                // save document to IPFS, return its hash, and set hash to state
                try {
                    await ipfs.add(_buffer, (err, ipfsHash) => {
                        setIpfsHash(ipfsHash[0].hash);
                        console.log("IPFS hash = ", ipfsHash[0].hash);
                        alert('File uploaded to IPFS!');

                        // create message by encrypting the IPFS hash using SHA3
                        const message = web3.utils.sha3(ipfsHash[0].hash); 
                        setMessage(message);
                        console.log("Encrypted IPFS hash(message) = ", message);
                        
                        // create digital signature
                        web3.eth.sign(message, accounts[0],
                          (err, signature) => {
                            setSignature(signature);
                            console.log("signature = ", signature);   
                            
                            // call Ethereum method-sendHash to send Ipfs hash to ethereum contract
                            // return transaction hash from ethereum
                            storehash.methods.sendHash(ipfsHash[0].hash).send(
                                {
                                    from: accounts[0],
                                },
                                (error, transactionHash) => {
                                    setTransactionHash(transactionHash);
                                    console.log(error, "TxHash = ", transactionHash);
                                    setIsDisabled(false);
                                    openNotification();
                                }
                            );
                         });
        
                        
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    return (
        <section className="upload">
            <h1> UPLOAD PAGE </h1>
            <Form form={form} layout="vertical">
                <Form.Item label="Filename" name="filename" rules={[{ required: true }]}>
                    <Input placeholder="filename" />
                </Form.Item>
                <Form.Item label="Dragger" name="dragger" rules={[{ required: true }]}>
                    <Upload.Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                    </Upload.Dragger>
                </Form.Item>
            </Form>
            <Button key="submit" onClick={handleUpload}>
                Upload and Sign
            </Button>

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
            
            {
                message ?
                <div className = "upload-results">
                    Message: {message}
                </div>
                : null
            }
            { signature ?
                <div className = "upload-results">
                    Digital Signature: {signature}
                </div>
                : null
            }
            <span
                className={`float ${isDisabled ? "disable" : ""}`}
                onClick={isDisabled ? () => {} : () => onTransactionReceiptClick()}
            >
                <i className="far fa-file-alt my-float"></i>
            </span>
        </section>
    );
};

export default UploadComponent;
