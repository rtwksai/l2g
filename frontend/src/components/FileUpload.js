import React, {useState} from 'react';
import axios from 'axios';

function FileUpload(){
	
    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

	const http = axios.create({
		baseURL: "http://localhost:5000",
		headers: {
			"Content-type": "application/json"
		}
	});

    const changeHandler = (e) => {
		setSelectedFile(e.target.files[0]);
		setIsFilePicked(true);
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
        <div>
            <input type="file" name="file" onChange={changeHandler} />
            {isFilePicked ? (
                <div>
                    <p>Filetype: {selectedFile.type}</p>
                </div>
            ) : (
                <p>Select a file to show details</p>
            )}
            
            <div>
                <button onClick={handleSubmission}>Submit</button>
            </div>
        </div>
    )
}

export default FileUpload;