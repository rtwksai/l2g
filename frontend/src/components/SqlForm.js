import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import {useEffect, useState} from 'react';
import { useReducer } from "react";
import axios from 'axios';

export default function SqlForm() {

    const [formInput, setFormInput] = useReducer(
      (state, newState) => ({ ...state, ...newState }),
      {
        db_uname: "",
        db_pass: "",
        db_name: "",
        db_url: ""
      }
    );

    const http = axios.create({
		baseURL: "http://localhost:5000",
		headers: {
			"Content-type": "application/json"
		}
	});

  


  const handleInput = evt => {

    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };

    const handleSubmission = (evt) => {
      evt.preventDefault();
		// const formData = new FormData();
		// formData.append('', formInput);
		// http.get("./query-db", formInput)
		// 	.then((response) => response.json)
		// 	.then((result) => {
		// 		console.log('Success:', result);
		// 	})
		// 	.catch((error) => {
		// 		console.error('Error:', error);
		// 	});

    console.log(formInput);

    const response = {'database': [
        {'table1': [{'column_name': 123, 'column_type' :456}, {'column_name': 12113, 'column_type':356}] },
        {'table2': [{'column_name': 112, 'column_type' :4256}, {'column_name': 113213, 'column_type':356}] },
        {'table3': [{'column_name': 123323, 'column_type' :3456}, {'column_name': 111233, 'column_type':356}] },
        {'table4': [{'column_name': 12342412, 'column_type' :4156}, {'column_name': 112313, 'column_type':356}] }
      
                    ]}
    
    window.localStorage.setItem("sql_data", JSON.stringify(response));



	};
    

  // const handleSubmit = evt => {
  //   evt.preventDefault();

  //   let data = { formInput };

  //   fetch("https://pointy-gauge.glitch.me/api/form", {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //     headers: {
  //       "Content-Type": "application/json"
  //     }
  //   })
  //     .then(response => response.json())
  //     .then(response => console.log("Success:", JSON.stringify(response)))
  //     .catch(error => console.error("Error:", error));
  // };

  // const handleInput = evt => {
  //   const name = evt.target.name;
  //   const newValue = evt.target.value;
  //   setFormInput({ [name]: newValue });
  // };
  
    return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        File Type = 
      </Typography>
      <form onSubmit={handleSubmission}>



      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="db_uname"
            name="db_uname"
            label="Database user name"
            fullWidth
            autoComplete="cc-name"
            variant="standard"
            onChange={handleInput}
            
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="db_pass"
            name="db_pass"
            label="Database password"
            fullWidth
            autoComplete="cc-number"
            variant="standard"
            type={"password"}
            onChange={handleInput}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="db_name"
            name="db_name"
            label="Database name"
            fullWidth
            autoComplete="cc-exp"
            variant="standard"
            onChange={handleInput}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="db_url"
            name="db_url"
            label="Database URL"
            helperText=""
            fullWidth
            autoComplete="cc-csc"
            variant="standard"
            onChange={handleInput}
          />
        
          <button onClick={handleSubmission}>Submit</button>
          
        </Grid>
      </Grid>
      </form>
    </React.Fragment>
  );
}