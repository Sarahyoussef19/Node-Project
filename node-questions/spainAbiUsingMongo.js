const http = require("http");
const fs = require("fs");
const url = require("url");
const { MongoClient } = require("mongodb");

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const mongoURI = "mongodb://localhost:27017";
const dbName = "playerBalancesDB";
const collectionName = "playerBalances";

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === "/random") {
    const { min, max } = parsedUrl.query;
    const minNum = parseInt(min);
    const maxNum = parseInt(max);

    if (isNaN(minNum) || isNaN(maxNum)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Invalid parameters: min and max must be valid numbers.",
        })
      );
    } else {
      const randomNumber = getRandomNumber(minNum, maxNum);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ randomNumber }));
    }
  } else if (parsedUrl.pathname === "/spin") {
    const { player } = parsedUrl.query;

    if (!player) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid player identifier." }));
      return;
    }

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    collection
      .findOneAndUpdate(
        { _id: player },
        { $inc: { balance: getRandomNumber(1, 10) } },
        { returnOriginal: false, upsert: true }
      )
      .then((result) => {
        const newBalance = result.value.balance;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ player, newBalance }));
      })
      .catch((err) => {
        console.error("Error updating player balance:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
