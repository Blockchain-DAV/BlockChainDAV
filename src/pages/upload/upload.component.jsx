import React, { useState } from "react";
import "./upload.styles.scss";
import { Form, Input, Upload} from "antd";
import Button from "../../components/button/button.component";
import { InboxOutlined } from "@ant-design/icons";

const UploadComponent = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const props = {
        onRemove: (file) => {
            setFileList((fileList) => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                return newFileList;
            });
        },
        beforeUpload: (file) => {
            setFileList((fileList) => [file]);
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

    const handleUpload = async () => {
        try {

         const isFileAvailable = fileList.length === 1
         if (!isFileAvailable) {
            form.setFields([
               {
                  name: "dragger",
                  errors: ["File is required"],
               },
            ]);
         }
         
         await form.validateFields()

         if(isFileAvailable){
            // upload action here
         }
            
        } catch (err) {
            
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
            <Button title="submit" onClick={handleUpload} />
        </section>
    );
};

export default UploadComponent;
