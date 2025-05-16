import { BrowserProvider, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import './App.css';
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import Display from "./components/Display";
import FileUpload from "./components/FileUpload";

function App() {
  const [account, setAccount] = useState("No Account Selected");
  const [contract, setContract] = useState(null);
  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          // Initialize the BrowserProvider
          const browserProvider = new BrowserProvider(window.ethereum);

          // Request accounts from MetaMask
          await browserProvider.send("eth_requestAccounts", []);

          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          const signer = await browserProvider.getSigner();

          // Get the connected account address
          const address = await signer.getAddress();
          setAccount(address);

          // Define the contract
          const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
          const uploadContract = new ethers.Contract(contractAddress, Upload.abi, signer);
          setContract(uploadContract);
        } catch (error) {
          console.error("Error connecting wallet:", error);
        }
      }
      else {
        alert("MetaMask is not installed");
      }
    };

    connectWallet();
  }, []);

  return (
    <>
      <div className="App">
        <h1 style={{ color: "green" }}>D-APP Storage Service</h1>
        <div className="bg"></div>
        <h3><b>Account</b></h3>
        <p style={{ color: "blue" }}>
          {account}
        </p>
        <FileUpload account={account} contract={contract}></FileUpload>
        <Display account={account} contract={contract}></Display>
      </div>
    </>
  );
}

export default App;


