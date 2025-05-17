import { BrowserProvider, ethers } from "ethers";
import { useEffect, useState } from "react";
import "./App.css";
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
          const browserProvider = new BrowserProvider(window.ethereum);
          await browserProvider.send("eth_requestAccounts", []);

          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          const signer = await browserProvider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // Replace with actual address
          const uploadContract = new ethers.Contract(
            contractAddress,
            Upload.abi,
            signer
          );
          setContract(uploadContract);
        } catch (error) {
          console.error("Error connecting wallet:", error);
        }
      } else {
        alert("MetaMask is not installed");
      }
    };

    connectWallet();
  }, []);

  return (
    <>
      <div className="App">
        <div className="bg"></div>
        <header>
          <div className="overlay">
            <h1>D-APP Storage Service</h1>
            <div className="account-info">
              <h3>
                <b>Connected Account</b>
              </h3>
              {account !== "No Account Selected" ? (
                <p className="account-card">
                  <span className="account-avatar">
                    {account.slice(2, 4).toUpperCase()}
                  </span>
                  {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              ) : (
                <p className="account-card">No Account Selected</p>
              )}
            </div>
          </div>
        </header>

        <main className="content">
          <section>
            <FileUpload account={account} contract={contract} />
          </section>
          <section style={{ marginTop: "50px" }}>
            <Display account={account} contract={contract} />
          </section>
        </main>

        <footer>
          &copy; {new Date().getFullYear()} D-APP Storage Service. All rights
          reserved.
        </footer>
      </div>
    </>
  );
}

export default App;
