// import axios from "axios";
// import { useState } from "react";
// import "./FileUpload.css";

// const FileUpload = ({ contract, account, provider }) => {
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState("No image selected");
//   const [imageId, setImageId] = useState(""); // Store Image ID for deletion

//   // Handle File Upload
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       alert("Please select an image first.");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       // Upload to Spring Boot backend
//       const response = await axios.post("http://localhost:8080/api/images/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const id = response.data.split(": ")[1]; // Extract image ID
//       const imageUrlId = id;
//       // Store Image id on Blockchain
//       if (contract) {
//         const tx = await contract.add(account, imageUrlId);
//         await tx.wait();
//         alert("Data Transaction stored on blockchain with ID !"+ imageUrlId);
//       }

//       setFileName("No image selected");
//       setFile(null);
//     } catch (e) {
//       alert("Image upload failed.");
//       console.error(e);
//     }
//   };

//   // Handle File Selection
//   const retrieveFile = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);
//     setFileName(selectedFile.name);
//   };

//   // Handle Image Deletion
//   const handleDelete = async () => {
//     if (!imageId) {
//       alert("Please enter an image ID to delete.");
//       return;
//     }

//     try {
//       // Call DELETE API on Spring Boot
//       await axios.delete(`http://localhost:8080/api/images/delete/${imageId}`);
//       const imageUrlId = imageId
//       // Remove Image Id from Blockchain
//       if (contract) {
//         const tx = await contract.remove(account, imageUrlId);
//         await tx.wait();
//         alert("Data Transaction removed from blockchain!");
//       }

//       setImageId(""); // Reset Image ID field
//     } catch (e) {
//       alert("Failed to delete the image.");
//       console.error(e);
//     }
//   };

//   return (
//     <div className="top">
//       <form className="form" onSubmit={handleSubmit}>
//         <label htmlFor="file-upload" className="choose">Choose Image</label>
//         <input
//           type="file"
//           id="file-upload"
//           name="data" onChange={retrieveFile} />
//         <span className="textArea">Image: {fileName}</span>
//         <button
//           type="submit"
//           className="upload" disabled={!file || !account}>Upload Image</button>
//       </form>

//       {/* Delete Image Section */}
//       <div className="delete-section">
//         <input
//           type="text"
//           placeholder="Enter Image ID to Delete"
//           value={imageId}
//           onChange={(e) => setImageId(e.target.value)}
//         />
//         <button className="delete-btn" onClick={handleDelete} disabled={!imageId || !account}>
//           Delete Image
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FileUpload;

// import { create as ipfsHttpClient } from 'ipfs-http-client';
// import { useState } from "react";
// import "./FileUpload.css";

// const ipfs = ipfsHttpClient('http://192.168.1.175:5001/api/v0');

// const FileUpload = ({ contract, account, provider }) => {
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState("No image selected");
//   const [imageId, setImageId] = useState(""); // CID for deletion

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       alert("Please select an image first.");
//       return;
//     }

//     try {
//       // Upload file to IPFS
//       const added = await ipfs.add(file);
//       const imageUrlId = added.path;

//       // Store CID on blockchain
//       if (contract) {
//         const tx = await contract.add(account, imageUrlId);
//         await tx.wait();
//         alert("Data Transaction stored on blockchain with ID !" + imageUrlId);
//       }

//       setFileName("No image selected");
//       setFile(null);
//     } catch (e) {
//       alert("Image upload failed.");
//       console.error(e);
//     }
//   };

//   const retrieveFile = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);
//     setFileName(selectedFile.name);
//   };

//   const handleDelete = async () => {
//     if (!imageId) {
//       alert("Please enter an image ID (CID) to delete.");
//       return;
//     }

//     try {
//       // Just remove CID from blockchain since IPFS is immutable
//       if (contract) {
//         const tx = await contract.remove(account, imageId);
//         await tx.wait();
//         alert("Data Transaction removed from blockchain!");
//         window.location.reload();
//       }

//       setImageId(""); // Reset Image ID field
//     } catch (e) {
//       alert("Failed to delete the image.");
//       console.error(e);
//     }
//   };

//   return (
//     <div className="top">
//       <form className="form" onSubmit={handleSubmit}>
//         <label htmlFor="file-upload" className="choose">Choose Image</label>
//         <input
//           type="file"
//           id="file-upload"
//           name="data"
//           onChange={retrieveFile}
//         />
//         <span className="textArea">Image: {fileName}</span>
//         <button
//           type="submit"
//           className="upload"
//           disabled={!file || !account}
//         >
//           Upload Image
//         </button>
//       </form>

//       {/* Delete Image Section */}
//       <div className="delete-section">
//         <input
//           type="text"
//           placeholder="Enter Image CID to Delete"
//           value={imageId}
//           onChange={(e) => setImageId(e.target.value)}
//         />
//         <button
//           className="delete-btn"
//           onClick={handleDelete}
//           disabled={!imageId || !account}
//         >
//           Delete Image
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FileUpload;

import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useEffect, useState } from "react";
import "./FileUpload.css";

const ipfs = ipfsHttpClient('http://192.168.1.175:5001/api/v0');

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [imageId, setImageId] = useState(""); // CID for deletion
  const [cidList, setCidList] = useState([]); // List of uploaded CIDs

  // Load user's stored CIDs from blockchain
  const loadCIDs = async () => {
    try {
      if (contract && account) {
        const cids = await contract.display(account);
        setCidList(cids);
      }
    } catch (e) {
      console.error("Failed to fetch CIDs:", e);
    }
  };

  useEffect(() => {
    loadCIDs();
  }, [contract, account]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    try {
      const added = await ipfs.add(file);
      const imageUrlId = added.path;

      if (contract) {
        const tx = await contract.add(account, imageUrlId);
        await tx.wait();
        alert("Stored on blockchain: " + imageUrlId);
        setCidList(prev => [...prev, imageUrlId]); // Add to dropdown
      }

      setFileName("No image selected");
      setFile(null);
    } catch (e) {
      alert("Upload failed.");
      console.error(e);
    }
  };

  const retrieveFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleDelete = async () => {
    if (!imageId) {
      alert("Please enter/select a CID to delete.");
      return;
    }

    try {
      if (contract) {
        const tx = await contract.remove(account, imageId);
        await tx.wait();
        alert("Removed from blockchain!");
        setCidList(cidList.filter(cid => cid !== imageId));
      }

      setImageId("");
    } catch (e) {
      alert("Deletion failed.");
      console.error(e);
    }
  };

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">Choose Image</label>
        <input type="file" id="file-upload" name="data" onChange={retrieveFile} />
        <span className="textArea">Image: {fileName}</span>
        <button type="submit" className="upload" disabled={!file || !account}>
          Upload Image
        </button>
      </form>

      {/* Dropdown List of CIDs */}
      <div className="cid-dropdown">
        <label htmlFor="cid-select">Your Uploaded CIDs:</label>
        <select
          id="cid-select"
          value={imageId}
          onChange={(e) => setImageId(e.target.value)}
        >
          <option value="">-- Select CID to Delete --</option>
          {cidList.map((cid, index) => (
            <option key={index} value={cid}>{cid}</option>
          ))}
        </select>
      </div>

      {/* Manual Input + Delete Button */}
      <div className="delete-section">
        <input
          type="text"
          placeholder="Enter CID to Delete"
          value={imageId}
          onChange={(e) => setImageId(e.target.value)}
        />
        <button className="delete-btn" onClick={handleDelete} disabled={!imageId || !account}>
          Delete Image
        </button>
      </div>
    </div>
  );
};

export default FileUpload;

