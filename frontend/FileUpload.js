import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import React, {useEffect, useState} from 'react';

import axios from 'axios';
// import AddressForm from './FileUpload';

export default function FileUpload(){
	
  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

	const http = axios.create({
		baseURL: "http://localhost:5000",
		headers: {
			"Content-type": "application/json"
		}
	});

    const changeHandler = (e) => {
        setIsFilePicked(true);
        setSelectedFile(e[0]);
	};

	const handleSubmission = () => {
		const formData = new FormData();
		formData.append('file', selectedFile);
		http.post("/upload", formData)
			.then((response) => response.json)
			.then((result) => {
				console.log('Success:', result);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

    
    return (
        <React.Fragment>
          <Grid container spacing={3}>
            <Grid item xs={12}>
            <DropzoneAreaBase
                onDrop={changeHandler}
                // onAdd={handleSubmission}
                onDelete={(fileObj) => console.log('Removed File:', fileObj)}
                onAlert={(message, variant) => console.log(`${variant}: ${message}`)}
            />
			<button onClick={handleSubmission}>Submit</button>
            </Grid>
          </Grid>
        </React.Fragment>
      )
}
