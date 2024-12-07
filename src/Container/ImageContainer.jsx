import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { API_URL } from '../utils/constants';
import "../../src/style.css"
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ImageContainer = (props) => {
  const [file, setFile] = useState(null); 
  const [previewSrc, setPreviewSrc] = useState(''); 
  const [state, setState] = useState({
    title: '',
    description: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false); 
  // const dropRef = useRef(); 

  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  };

  const navigate = useNavigate()

  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
    // dropRef.current.style.border = '2px dashed #e9ebeb';
  };

  // const updateBorder = (dragState) => {
  //   if (dragState === 'over') {
  //     dropRef.current.style.border = '2px solid #000';
  //   } else if (dragState === 'leave') {
  //     dropRef.current.style.border = '2px dashed #e9ebeb';
  //   }
  // };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    try {
      const { title, description } = state;
      if (title.trim() !== '' && description.trim() !== '') {
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('title', title);
          formData.append('description', description);

          setErrorMsg('');
          await axios.post(`${API_URL}/upload`, formData, {
            // headers: {
            //   'Content-Type': 'multipart/form-data'
            // }
          }).then(()=>{
            toast.success("File Uploaded Succssesfully")
            navigate("/getAllFiles")
 
          });
          // props.history.push('/list');
        } else {
          setErrorMsg('Please select a file to add.');
          alert("Not saved")
        }
      } else {
        setErrorMsg('Please enter all the field values.');
      }
    } catch (error) {
      error.response && setErrorMsg(error.response.data);
    }
  };

  return (
    <>
      <Form className="search-form" onSubmit={handleOnSubmit}>
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Control
                type="text"
                name="title"
                value={state.title || ''}
                placeholder="Enter title"
                onChange={handleInputChange}
                className="custom-input"
              />
            </Form.Group>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
            <Form.Group controlId="description">
              <Form.Control
                type="text"
                name="description"
                value={state.description || ''}
                placeholder="Enter description"
                onChange={handleInputChange}
                className="custom-input"
              />
            </Form.Group>
          </Col>
        </Row>
        <br/>
        <div className="upload-section">
          <Dropzone
            onDrop={onDrop}
            // onDragEnter={() => updateBorder('over')}
            // onDragLeave={() => updateBorder('leave')}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps({ className: 'drop-zone' })}>
                <input {...getInputProps()} />
                <p>Drag and drop a file OR click here to select a file</p>
                {file && (
                  <div>
                    <strong>Selected file:</strong> {file.name}
                  </div>
                )}
              </div>
            )}
          </Dropzone>
          {previewSrc ? (
            isPreviewAvailable ? (
              <div className="image-preview">
                <img className="preview-image" src={previewSrc} alt="Preview" />
              </div>
            ) : (
              <div className="preview-message">
                <p>No preview available for this file</p>
              </div>
            )
          ) : (
            <div className="preview-message">
              <p>Image preview will be shown here after selection</p>
            </div>
          )}
        </div>
        <Button className='' variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default ImageContainer;
