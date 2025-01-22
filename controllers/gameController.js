const User = require('../models/User'); // Import the User model
const Game = require('../models/Game');  // Import the Game model

const startGame = async (req, res) => {
  try {
    const { opponentUsername } = req.body;
    const userX = await User.findById(req.user.id);
    const userO = await User.findOne({ username: opponentUsername });

    if (!userX || !userO) {
      return res.status(400).json({ message: 'User(s) not found' });
    }

    const newGame = new Game({
      playerX: userX._id,
      playerO: userO._id,
      board: Array(9).fill(null),
      currentPlayer: 'X',
      moves: [],
    });

    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to start game' });
  }
};


// Make a move in the game
const makeMove = async (req, res) => {
  const { gameId, position } = req.body;

  try {
    // Validate position
    if (position < 0 || position > 8) {
      return res.status(400).json({ message: 'Invalid position' });
    }

    // Fetch the game from the database
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Ensure no move is made after the game is over
    if (game.winner) {
      return res.status(400).json({ message: 'Game has already ended' });
    }

    // Check if the move is valid (spot is empty)
    if (game.board[position] !== null) {
      return res.status(400).json({ message: 'Invalid move' });
    }

    // Make the move
    game.board[position] = game.currentPlayer;

    // Track the move in the history (moves array)
    game.moves.push({ position, player: game.currentPlayer, timestamp: new Date() });

    // Check for a draw
    if (checkDraw(game.board)) {
      game.winner = 'draw';
      await game.save(); // Save the game state after the move
      return res.status(200).json({ message: 'It\'s a draw!', game });
    }

    // Check for a winner
    const winner = checkWinner(game.board);
    if (winner) {
      game.winner = winner;
      await game.save(); // Save the game state after the move
      return res.status(200).json({ message: `${winner} wins!`, game });
    }

    // Switch player
    game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
    await game.save(); // Save the game state after the move

    res.status(200).json({ message: 'Move made successfully', game });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if the game is a draw
const checkDraw = (board) => {
  return board.every(cell => cell !== null) && !checkWinner(board);
};

// Check if there's a winner
const checkWinner = (board) => {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // 'X' or 'O'
    }
  }
  return null; // No winner
};

const mongoose = require('mongoose');

const getHistory = async (req, res) => {
  try {
    console.log('User ID:', req.user.id); // Log user ID

    const userId = new mongoose.Types.ObjectId(req.user.id); // Ensure userId is valid ObjectId

    const games = await Game.find({
      $or: [{ playerX: userId }, { playerO: userId }],
    }).sort({ createdAt: -1 });

    console.log('Games found:', games); // Log the games retrieved

    if (games.length === 0) {
      return res.status(404).json({ message: 'No game history found' });
    }

    const history = await Promise.all(games.map(async (game) => {
      const opponentId = game.playerX.toString() === userId.toString() ? game.playerO : game.playerX;
      const opponent = await User.findById(opponentId);
      return {
        opponent: opponent ? opponent.username : 'Unknown',
        result: game.winner || 'draw',
        timeline: game.moves.map(move => ({
          position: move.position,
          player: move.player,
          timestamp: move.timestamp,
        })),
      };
    }));

    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch game history' });
  }
};

// Restart an existing game
const restartGame = async (req, res) => {
  const { gameId } = req.body;

  try {
    // Fetch the game from the database
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Reset the board and game state
    game.board = Array(9).fill(null);
    game.currentPlayer = 'X';
    game.winner = null;
    game.moves = []; // Clear previous moves history

    // Save the restarted game
    await game.save();

    res.status(200).json({ message: 'Game restarted successfully', game });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to restart the game' });
  }
};

module.exports = { startGame, makeMove, checkWinner, checkDraw, getHistory, restartGame };
