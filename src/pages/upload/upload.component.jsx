import React from 'react';
import './upload.styles.scss';
import Button from '../../components/button/button.component';

const Upload = () => (
   <section className = 'upload'>
      UPLOAD PAGE

      <form action = '/upload' method = "POST" enctype="multipart/form-data">
         <label>Filename</label>
        <input type="text" name="fileName" />
        <label>Upload File</label>
        <input type="file" name="file" />
         < Button title = "submit" />
      </form>
   </section>
);

export default Upload;