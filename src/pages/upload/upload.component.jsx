import React, { useState } from "react";
import "./upload.styles.scss";
import { Form, Input, Upload } from "antd";
import Button from "../../components/button/button.component";
import { InboxOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { address, abi } from "../../storehash";
import Web3 from "web3";
import ipfs from "../../ipfs";
import storehash from "../../storehash";

const UploadComponent = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    //state for ipfs and smart contract
    const [buffer, setBuffer] = useState("");
    const [metamaskAccount, setMetamaskAccount] = useState(null);
    const [smartContract, setSmartContract] = useState(null);

    const [ipfsHash, setIpfsHash] = useState(null);
    const [transactionHash, setTransactionHash] = useState(null);

    //loading states
    const [onTransactionReceiptLoading, setTransactionReceiptLoading] = useState(null);
    const [transactionReceipt, setTransactionReceipt] = useState(null);


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
            setTransactionReceiptLoading(true);
            const web3 = await new Web3(Web3.givenProvider); // Provider from Metamask

            if (!transactionHash) {
                console.log("NO transaction Hash provided");
                return;
            }

            // get Transaction Receipt in console on click
            await web3.eth.getTransactionReceipt(transactionHash, (err, txReceipt) => {
                if (txReceipt !== null) {
                    console.log("txReceipt: ", txReceipt);
                    setTransactionReceipt(txReceipt);
                    setTransactionReceiptLoading(false);
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
                const web3 = new Web3(Web3.givenProvider);
                const accounts = await web3.eth.getAccounts();
                setMetamaskAccount(accounts[0]);

                //smart contract
                const smartContract = new web3.eth.Contract(abi, address);
                console.log("smartContract: ", smartContract);
                setSmartContract(smartContract);

                //ipfs implementation

                //save document to IPFS,return its hash, and set hash to state
                try {
                    await ipfs.add(_buffer, (err, ipfsHash) => {
                        setIpfsHash(ipfsHash[0].hash);

                        // call Ethereum method-sendHash to send this ipfs hash to ethereum contract
                        // retrun transaction hash from ethereum

                        storehash.methods.sendHash(ipfsHash[0].hash).send(
                            {
                                from: accounts[0],
                            },
                            (error, transactionHash) => {
                                console.log("transactionHash: ", transactionHash);
                                setTransactionHash(transactionHash);
                            }
                        );
                    });
                } catch (error) {
                    console.log(error);
                }

                // upload action here
            }
        } catch (err) {}
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
            <Button title="submit" onClick={handleUpload} />

            {transactionReceipt
                ? Object.entries(transactionReceipt)
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
                : onTransactionReceiptLoading && <Spin size="large" />}
            <span className="float" onClick={onTransactionReceiptClick}>
                <i className="far fa-file-alt my-float"></i>
            </span>
        </section>
    );
};

export default UploadComponent;
