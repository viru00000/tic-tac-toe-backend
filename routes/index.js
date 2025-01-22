const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const { startGame, makeMove, getHistory, restartGame } = require('../controllers/gameController');
const {registerUser , loginUser} = require('../controllers/authController');


router.post('/register', registerUser);
router.post('/login', loginUser);


router.post('/start-game', authenticateToken, startGame);


router.post('/make-move', authenticateToken, makeMove);


router.get('/history', authenticateToken, getHistory);


router.post('/restart-game', authenticateToken, restartGame);

module.exports = router;
