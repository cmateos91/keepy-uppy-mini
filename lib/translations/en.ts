export const en = {
  // General
  loading: "Loading...",

  // Start Screen
  start: {
    title: "KEEPY UPPY",
    subtitle: "Don't let the ball fall!",
    play: "Play",
    leaderboard: "Leaderboard",
    buyLives: "Buy Lives",
    freePlayAvailable: "Free play available",
    livesCount: "{count} lives",
    noLives: "No lives left",
    todayBest: "Today's Best",
    rank: "Rank",
    unranked: "Unranked",
    points: "pts",
  },

  // Game Over Screen
  gameOver: {
    title: "GAME OVER",
    score: "Score",
    best: "Best",
    newRecord: "New Record!",
    rank: "Rank",
    unranked: "Unranked",
    playAgain: "Play Again",
    leaderboard: "Leaderboard",
    buyLives: "Buy Lives",
    noLivesLeft: "No lives left",
  },

  // Leaderboard
  leaderboard: {
    title: "TODAY'S LEADERBOARD",
    close: "Close",
    empty: "No scores yet",
    you: "(You)",
    yourRank: "Your Rank",
    points: "pts",
  },

  // Buy Lives Modal
  buyLives: {
    title: "Buy Lives",
    description: "Get 3 extra lives to keep playing!",
    price: "Price",
    lives: "3 lives",
    buyButton: "Buy 3 Lives",
    processing: "Processing...",
    success: "Lives added successfully!",
    error: "Transaction failed",
    cancel: "Cancel",
  },

  // Score Display
  score: {
    score: "Score",
    best: "Best",
  },

  // Language
  language: {
    en: "English",
    es: "Spanish",
  },
};

export type Translations = typeof en;
