import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import React, {useEffect, useState} from 'react';
// import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import LocalSchema from './LocalSchema';
// import AddressForm from './FileUpload';


export default function SelectType(props) {

    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

    const [schemaType_, setSchemaType_] = React.useState('');
	
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

	const handleChange = (event) => {
        setSchemaType_(event.target.value);
      };

    const handleSelection = () => {
        console.log(schemaType_);
		if(schemaType_ == 'sql')
        {
            props.onChange_sT('sql');
            console.log("SQL type selected");
        }
        else
        {
            props.onChange_sT('csv');
            console.log("CSV type selected");
        }
	};
    
    return (
        <React.Fragment>
          <Grid container spacing={3}>
            <Grid item xs={12}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Schema Type</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={schemaType_}
                    label="SchemaType_"
                    onChange={handleChange}
                >
                    <MenuItem value={'sql'}>SQL</MenuItem>
                    <MenuItem value={'csv'}>CSV</MenuItem>
                </Select>
                </FormControl>
                <button onClick={handleSelection}>Confirm</button>
            </Grid>
          </Grid>
        </React.Fragment>
      )
}
