import { create as ipfsHttpClient } from "ipfs-http-client";
import { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import "./FileUpload.css";

const ipfs = ipfsHttpClient("http://192.168.137.43:5001/api/v0");

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [imageId, setImageId] = useState("");
  const [cidList, setCidList] = useState([]);

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
  }, [contract, account, loadCIDs]);

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
        setCidList((prev) => [...prev, imageUrlId]);
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
        setCidList(cidList.filter((cid) => cid !== imageId));
      }

      setImageId("");
    } catch (e) {
      alert("Deletion failed.");
      console.error(e);
    }
  };

  const handleCopy = () => {
    if (imageId) {
      navigator.clipboard.writeText(imageId);
      alert("CID copied to clipboard!");
    }
  };

  return (
    <div className="container">
      <h2>D-APP Storage Service</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">Image: {fileName}</span>
        <button type="submit" className="upload" disabled={!file || !account}>
          Upload Image
        </button>
      </form>

      <div className="cid-dropdown">
        <label htmlFor="cid-select">Your Uploaded CIDs:</label>
        <div className="cid-select-row">
          <select
            id="cid-select"
            value={imageId}
            onChange={(e) => setImageId(e.target.value)}
          >
            <option value="">-- Select CID to Delete --</option>
            {cidList.map((cid, index) => (
              <option key={index} value={cid}>
                {cid}
              </option>
            ))}
          </select>
          <button
            className="copy-btn"
            type="button"
            onClick={handleCopy}
            disabled={!imageId}
            aria-label="Copy CID"
            title="Copy CID"
          >
            <FaRegCopy />
          </button>
        </div>
      </div>

      <div className="delete-section">
        <input
          type="text"
          placeholder="Enter CID to Delete"
          value={imageId}
          onChange={(e) => setImageId(e.target.value)}
          aria-label="CID to delete"
        />
        <button
          className="delete-btn"
          onClick={handleDelete}
          disabled={!imageId || !account}
        >
          Delete Image
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
