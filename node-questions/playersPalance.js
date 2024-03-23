//Node tasks, Sol 1
const fs = require("fs");
const path = require("path");

const initialBalances = {
  "Player A": 500,
  "Player B": 600,
};

const filePath = path.join(__dirname, "players_data.json");

function readPlayerData() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return initialBalances;
  }
}

function writePlayerData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");
}

function getPlayerBalance(playerName) {
  const playerData = readPlayerData();
  return playerData[playerName];
}

function updatePlayerBalance(playerName, amount) {
  const playerData = readPlayerData();
  playerData[playerName] += amount;
  writePlayerData(playerData);
}

console.log("Initial balance of Player A:", getPlayerBalance("Player A"));
console.log("Initial balance of Player B:", getPlayerBalance("Player B"));

// Case we wanna update balance
updatePlayerBalance("Player A", 100);

console.log("Updated balance of Player A:", getPlayerBalance("Player A"));
