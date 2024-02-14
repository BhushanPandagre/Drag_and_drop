import ImageContainer from "./Container/ImageContainer";
import "../src/style.css"
import NavBar from "./Container/NavBar";
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Removed Router
import FilesList from "./Container/FileList";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar/>
        <h1 style={{paddingTop:20}}>DragAndDrop</h1>
        <Routes>
        <Route index path="/" element={<ImageContainer/>}/>
        <Route path="/getAllFiles" element={<FilesList/>}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
