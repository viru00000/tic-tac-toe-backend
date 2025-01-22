document.addEventListener('DOMContentLoaded', () => {
  let playerId = null;
  let token = null;
  let gameId = null;
  let currentPlayer = 'X';
  let gameBoard = Array(9).fill(null);

  // Show login form
  document.getElementById('showLogin').addEventListener('click', () => {
    document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'block';
  });

  // Handle User Registration
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.message === 'User registered successfully') {
      alert('Registration successful! Please log in.');
      document.getElementById('register').style.display = 'none';
      document.getElementById('login').style.display = 'block';
    } else {
      alert(data.message || 'Registration failed!');
    }
  });

  // Handle User Login
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.token) {
      token = data.token;
      playerId = data.userId;
      console.log('Player ID:', playerId);
      alert('Login successful!');
      document.getElementById('login').style.display = 'none';
      document.getElementById('gameControls').style.display = 'block';
      document.querySelector('h2').style.display = 'none'; // Hide Register/Login title
    } else {
      alert(data.message || 'Login failed!');
    }
  });

  // Handle the start game button
  document.getElementById('startGame').addEventListener('click', async () => {
    const opponentUsername = document.getElementById('inviteUsername').value;
    if (!opponentUsername) {
      alert('You must enter an opponent\'s username to start a game!');
      return;
    }

    // Start the game by sending a request to the backend
    const response = await fetch('http://localhost:5000/api/start-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Use token to authenticate
      },
      body: JSON.stringify({
        opponentUsername,
      }),
    });

    const data = await response.json();
    if (data._id) {
      gameId = data._id;
      alert('Game started successfully!');
      document.getElementById('gameControls').style.display = 'none';
      document.getElementById('gameBoard').style.display = 'block';
      document.getElementById('restartGame').style.display = 'block'; // Show restart button
      document.getElementById('fetchHistory').style.display = 'block'; // Show history button
      initializeBoard(); // Initialize the game board for a new game
    } else {
      alert(data.message || 'Failed to start the game');
    }
  });

  // Handle the restart game button
  document.getElementById('restartGame').addEventListener('click', async () => {
    if (!gameId) {
      alert('No game to restart!');
      return;
    }

    // Restart the game by sending a request to the backend
    const response = await fetch('http://localhost:5000/api/restart-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Use token to authenticate
      },
      body: JSON.stringify({ gameId }),
    });

    const data = await response.json();
    if (data.game) {
      alert('Game restarted successfully!');
      initializeBoard(); // Initialize the game board for a new game
    } else {
      alert(data.message || 'Failed to restart the game');
    }
  });

  // Handle the fetch history button
  document.getElementById('fetchHistory').addEventListener('click', async () => {
    const response = await fetch('http://localhost:5000/api/history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const historyData = await response.json();
    if (historyData.length) {
      // Display the game history
      const historyList = document.getElementById('historyList');
      historyList.innerHTML = '';
      historyData.forEach((game, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <strong>Game ${index + 1}</strong><br>
          <strong>Game ID:</strong> ${game._id}<br>
          <strong>Opponent:</strong> ${game.opponent}<br>
          <strong>Result:</strong> ${game.result}<br>
          <strong>Moves:</strong>
          <ul>
            ${game.timeline.map(move => `
              <li>
                <strong>Player:</strong> ${move.player} | <strong>Position:</strong> ${move.position} | <strong>Time:</strong> ${new Date(move.timestamp).toLocaleString()}
              </li>
            `).join('')}
          </ul>
        `;
        historyList.appendChild(listItem);
      });
      document.getElementById('gameHistory').style.display = 'block';
    } else {
      alert('No game history found!');
    }
  });

  // Initialize the game board
  function initializeBoard() {
    gameBoard = Array(9).fill(null);
    currentPlayer = 'X';
    document.getElementById('gameBoard').querySelectorAll('.cell').forEach((cell, index) => {
      cell.textContent = '';
      cell.addEventListener('click', () => handleCellClick(index));
    });
  }

  // Handle cell clicks
  function handleCellClick(index) {
    if (gameBoard[index] || checkWin()) return;

    gameBoard[index] = currentPlayer;
    document.getElementById(`cell-${index}`).textContent = currentPlayer;

    if (checkWin()) {
      alert(`Player ${currentPlayer} wins!`);
    } else if (gameBoard.every(cell => cell)) {
      alert('It\'s a tie!');
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  // Check for a winning combination
  function checkWin() {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
      const [a, b, c] = pattern;
      return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c];
    });
  }
});
