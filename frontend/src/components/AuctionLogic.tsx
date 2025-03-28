import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AuctionLogic() {
  const [inventory, setInventory] = useState([]);
  const [newBids, setNewBids] = useState({});

  //function to get list of items and latest bid
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

  // Logic for initializing a new bid from the user
  const sendBid = (itemId, newBid, newBidUser) => {
    if (!newBid || isNaN(newBid) || newBid <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }
    axios
      .post("http://localhost:3000/bid", {
        id: itemId,
        newBid: parseFloat(newBid),
        newBidUser: newBidUser,
      })
      .then((response) => {
        retrieveItemList();
        console.log(response.data.message);
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage =
            error.response.data.error || "An unknown error occurred";
          console.log(`Error: ${error.response.status} - ${errorMessage}`);
          alert(`Error: ${error.response.status} - ${errorMessage}`);
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
        Logged in as Pushpa Raj (pushpa@somewhere.com)
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
                        src={
                          "https://images.squarespace-cdn.com/content/v1/5cb3485aebfc7f375fb3d93c/1714295266554-99G28PUMWCZ8T06LUXD5/280422+Antique+pots+XL+-+10.jpeg"
                        }
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
                            sendBid(item.id, newBids[index], "Pushpa")
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
