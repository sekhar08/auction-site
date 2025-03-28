const express = require("express");
const dbJson = require("./items-db.json");
const path = require("path");

const app = express();
app.use(express.json());


app.use("/images", express.static(path.join(__dirname, "public")));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});


app.listen(3000, () => {
    setInterval(virtualBid, 5000);
    console.log("✅ Server started and listening on port 3000...");
});


app.get("/list", (req, res) => {
    console.log(`GET /list received @ ${new Date().toISOString()}`);
    res.json(dbJson);
});


app.post("/bid", (req, res) => {
    const { id, newBid, newBidUser } = req.body;
    console.log(`POST /bid received @ ${new Date().toISOString()}`);
    console.log(`Item ID: ${id}, New Bid: ${newBid}, User: ${newBidUser}`);

    // Validate the input Input
    if (!id || !newBid || !newBidUser) {
        return res.status(400).json({ error: "Missing required parameters." });
    }
    if (isNaN(newBid) || newBid <= 0) {
        return res.status(400).json({ error: "Invalid bid amount." });
    }

    // Find the Item
    const item = dbJson.find((item) => item.id === id);
    if (!item) {
        return res.status(404).json({ error: "Item not found." });
    }

    // Check the Bid Validity
    if (item.lastBid >= newBid) {
        return res.status(400).json({ error: "Bid is not high enough." });
    }

    // Update the following Bid
    item.lastBid = parseFloat(newBid);
    item.lastBidUser = newBidUser;
    console.log(`Bid updated successfully for item ${id}.`);
    res.json({ message: "Bid placed successfully!" });
});

// function for Virtual Bidding
function virtualBid() {
    console.log(`Virtual Bidding Triggered @ ${new Date().toISOString()}`);

    dbJson.forEach((item) => {
        const increasePercentage = Math.random() * 2;
        const increaseAmount = (item.lastBid * increasePercentage) / 100;
        
        // Avoid Negative Bids
        const newBid = Math.max(item.lastBid + increaseAmount, item.lastBid);
        
        item.lastBid = parseFloat(newBid.toFixed(2));
        item.lastBidUser = "anonymous";
    });
}
