

import React, { useState, useEffect } from 'react';
import download from 'downloadjs';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { toast } from 'react-toastify';

const FilesList = () => {
  const [filesList, setFilesList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const getFilesList = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/getAllFiles`);
      setErrorMsg('');
      setFilesList(data);
    } catch (error) {
      error.response && setErrorMsg(error.response.data);
    }
  };

  useEffect(() => {
    getFilesList();
  }, []);

  const downloadFile = async (id, path, mimetype) => {
    try {
      const result = await axios.get(`${API_URL}/download/${id}`, {
        responseType: 'blob'
      });
      const split = path.split('/');
      const filename = split[split.length - 1];
      setErrorMsg('');
      return download(result.data, filename, mimetype);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg('Error while downloading file. Try again later');
      }
    }
  };

  const DeleteFile = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      setErrorMsg('');
      // Show alert
      toast.error('File deleted successfully');
      // Refresh the files list
      getFilesList();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg('Error while deleting file. Try again later');
      }
    }
  };

  return (
    <div className="files-container">
      {errorMsg && <p className="errorMsg">{errorMsg}</p>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>DOWNLOAD File</th>
            <th>DELETE File</th>
          </tr>
        </thead>
        <tbody>
          {filesList.length > 0 ? (
            filesList.map(
              ({ _id, title, description, file_path, file_mimetype }) => (
                <tr key={_id}>
                  <td className="file-title">{title}</td>
                  <td className="file-description">{description}</td>
                  <td>
                    <a
                      href="#/"
                      onClick={() =>
                        downloadFile(_id, file_path, file_mimetype)
                      }
                      className="btn btn-primary"
                    >
                      Download
                    </a>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => DeleteFile(_id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
                No files found. Please add some.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FilesList;

