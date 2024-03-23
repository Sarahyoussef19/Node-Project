db.transactions.aggregate([
  {
    $group: {
      _id: "$games_id",
      num_bets: { $sum: 1 },
    },
  },
  {
    $lookup: {
      from: "games",
      localField: "_id",
      foreignField: "_id",
      as: "game",
    },
  },
  {
    $unwind: "$game",
  },
  {
    $project: {
      game_name: "$game.name",
      num_bets: 1,
    },
  },
  {
    $sort: { num_bets: -1 },
  },
  {
    $limit: 3,
  },
]);
