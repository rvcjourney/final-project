// import { useState } from "react";
// import "./Display.css";
// const Display = ({ contract, account }) => {
//   const [data, setData] = useState("");
//   const getdata = async () => {
//     let dataArray;
//     const Otheraddress = document.querySelector(".address").value;
//     try {
//       if (Otheraddress) {
//         dataArray = await contract.display(Otheraddress);

//       } else {
//         dataArray = await contract.display(account);
//       }
//       console.log(dataArray);
//     } catch (e) {
//       alert("You don't have access");
//     }
//     const isEmpty = Object.keys(dataArray).length === 0;

//     if (!isEmpty) {
//       const str = dataArray.toString();
//       const str_array = str.split(",");
//       console.log(str);
//       console.log(str_array);
//       const images = str_array.map((item, i) => {
//         const imageUrl = `http://localhost:8080/api/images/${item}`;
//         return (
//           <a href={imageUrl} key={i}>
//             <img
//               key={i}
//               src={imageUrl}
//               alt="Image_Data"
//               className="image-list"
//             ></img>
//           </a>
//         );
//       });
//       setData(images);
//     } else {
//       alert("No image to display");
//     }
//   };
//   return (
//     <>
//       <div className="image-list">{data}</div>
//       <input
//         type="text"
//         placeholder="Enter Address"
//         className="address"
//       ></input>
//       <button className="center button" onClick={getdata}>
//         Get Data
//       </button>
//     </>
//   );
// };
// export default Display;

import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);

  const getdata = async () => {
    let dataArray = [];
    const Otheraddress = document.querySelector(".address").value;

    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress);
      } else {
        dataArray = await contract.display(account);
      }
    } catch (e) {
      alert("You don't have access or contract error.");
      return;
    }

    if (!dataArray || dataArray.length === 0) {
      alert("No image to display");
      setData([]);
      return;
    }

    // Assuming dataArray is an array of CIDs (strings)
    const images = dataArray.map((cid, i) => {
      // Replace localhost with your IPFS gateway IP if needed
      const ipfsGatewayUrl = `http://192.168.137.43:8080/ipfs/${cid}`;
      return (
        <a
          href={ipfsGatewayUrl}
          key={i}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={ipfsGatewayUrl}
            alt={`Image ${cid}`}
            className="image-list"
          />
        </a>
      );
    });

    setData(images);
  };

  return (
    <>
      <div className="image-list">{data}</div>
      <input type="text" placeholder="Enter Address" className="address" />
      <button className="center button" onClick={getdata}>
        Get Data
      </button>
    </>
  );
};

export default Display;
