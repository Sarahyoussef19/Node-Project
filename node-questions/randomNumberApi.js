//Node tasks, Sol 2, 3 and 4
const http = require("http");
const fs = require("fs");
const url = require("url");

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let playerBalances = {};

fs.readFile("players_data.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading player data:", err);
    return;
  }

  playerBalances = JSON.parse(data);
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
    const playerBalance = playerBalances[player];

    if (!player || !playerBalance) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid player identifier." }));
    } else {
      const randomNumber = getRandomNumber(1, 10);
      const newBalance = playerBalance + randomNumber;

      playerBalances[player] = newBalance;

      fs.writeFile(
        "players_data.json",
        JSON.stringify(playerBalances),
        (err) => {
          if (err) {
            console.error("Error updating player data:", err);
          }
        }
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ player, newBalance }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
