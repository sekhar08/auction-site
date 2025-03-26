import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TreasureTrove() {
  const [inventory, setInventory] = useState([]);
  const [newBids, setNewBids] = useState({});

  // GET list of items and latest bids
  const retrieveItemList = () => {
    console.log("retrieveItemList() called");
    axios
      .get("http://localhost:3000/list")
      .then((response) => {
        setInventory(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(
            `Server error: ${error.response.status} - ${error.response.data}`
          );
          alert(`Error: ${error.response.status} - ${error.response.data}`);
        }
      });
  };

  // POST a new bid
  const sendBid = (itemId, newBid, newBidUser) => {
    console.log(`sendBid(${itemId}, ${newBid}, ${newBidUser}) called`);
    if (!newBid || isNaN(newBid) || newBid <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }
    axios
      .post(
        `http://localhost:3000/bid?id=${itemId}&newbid=${newBid}&newbiduser=${newBidUser}`
      )
      .then((response) => {
        retrieveItemList();
        console.log("The server accepted your bid");
      })
      .catch((error) => {
        if (error.response) {
          console.log(
            `Error: ${error.response.status} - ${error.response.data}`
          );
          alert(`Error: ${error.response.status} - ${error.response.data}`);
        }
      });
  };

  useEffect(() => {
    retrieveItemList();
    const interval = setInterval(retrieveItemList, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#cddffa] overflow-x-hidden p-4">
      <h1 className="text-darkblue font-bold text-5xl text-center my-4">
        Treasure Trove
      </h1>
      <p className="text-blue font-medium text-xl text-center">
        Logged in as Linda Mar (lindam@somewhere.com)
      </p>

      <div className="max-w-[95%] mx-auto text-left">
        <div className="flex flex-wrap">
          <div className="w-full pr-8">
            <table className="w-full mb-8 border-collapse">
              <tbody>
                {inventory.map((item, index) => (
                  <tr key={item.id} className="mb-6">
                    <td className="align-top">
                      <img
                        className="h-32 w-32 object-cover rounded-lg shadow-md"
                        src={item.imageUrl}
                        alt={`${item.name} image`}
                      />
                    </td>
                    <td>
                      <p className="text-black font-bold text-2xl mb-1 mt-0.5">
                        {item.name}
                      </p>
                      <hr className="mb-1 mt-0" />
                      <p className="text-black text-lg">{item.description}</p>
                      <p className="text-purple font-bold text-xl">
                        {item.lastBidUser == null
                          ? `Opening bid: $${item.lastBid.toFixed(2)}`
                          : `Last bid: $${item.lastBid.toFixed(2)} by ${
                              item.lastBidUser
                            }`}
                      </p>
                      <p>
                        Your bid:
                        <input
                          type="number"
                          value={newBids[index] || ""}
                          onChange={(e) =>
                            setNewBids({ ...newBids, [index]: e.target.value })
                          }
                          className="border p-1 ml-2 rounded"
                        />
                        <button
                          onClick={() =>
                            sendBid(item.id, newBids[index], "lindam")
                          }
                          className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Bid
                        </button>
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
