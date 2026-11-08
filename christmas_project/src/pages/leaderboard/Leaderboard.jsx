import React from "react";
import "./leaderboard.css";

const Leaderboard = () => {
  const leaderboardData = [
    { name: "Alice", votes: 25 },
    { name: "Bob", votes: 18 },
    { name: "Charlie", votes: 15 },
  ];

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>
      <div className="leaderboard-cards">
        {leaderboardData.map((entry, index) => (
          <div className="leaderboard-card" key={index}>
            <div className="rank">#{index + 1}</div>
            <div className="name">{entry.name}</div>
            <div className="votes">Votes: {entry.votes}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
