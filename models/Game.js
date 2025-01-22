const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  playerX: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  playerO: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  board: { type: [String], default: Array(9).fill(null) },
  currentPlayer: { type: String, enum: ['X', 'O'], default: 'X' },
  winner: { type: String, enum: ['X', 'O', 'draw'], default: null },
  moves: [{ position: Number, player: String, timestamp: Date }],
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;

