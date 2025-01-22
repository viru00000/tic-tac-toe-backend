<<<<<<< HEAD
# tic-tac-toe-backend
A backend project for Tic-Tac-Toe with user authentication and game tracking.
=======

# Tic-Tac-Toe Backend API

This project provides the backend logic for a Tic-Tac-Toe game. It includes functionality for user registration and login, game creation, making moves, tracking game history, and restarting games. This is designed for a multiplayer experience, where one player (Player X) can start a game and invite an opponent (Player O) to play.

## Features

- **User Registration**: Allows users to create an account.
- **User Login**: Users can log in to play the game.
- **Start a Game**: A player can start a new game and invite an opponent.
- **Make a Move**: Players can make a move on the Tic-Tac-Toe board.
- **Game History**: Players can view the history of games they’ve played, including the timeline of moves.
- **Restart a Game**: Players can restart a game with the same opponent.

## API Endpoints

### 1. **POST /api/register**
Registers a new user.

- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully"
  }
  ```

### 2. **POST /api/login**
Logs in an existing user and returns a JWT token.

- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "JWT_TOKEN"
  }
  ```

### 3. **POST /api/start-game**
Starts a new game by linking two players (Player X and Player O).

- **Request Body**:
  ```json
  {
    "opponentUsername": "string"
  }
  ```
- **Response**:
  ```json
  {
    "gameId": "string",
    "playerX": "USER_ID",
    "playerO": "USER_ID",
    "board": [null, null, null, null, null, null, null, null, null],
    "currentPlayer": "X",
    "moves": []
  }
  ```

### 4. **POST /api/make-move**
Makes a move on the game board.

- **Request Body**:
  ```json
  {
    "gameId": "string",
    "position": 0
  }
  ```
- **Response**:
  ```json
  {
    "message": "Move made successfully",
    "game": {
      "gameId": "string",
      "board": [null, "X", null, null, "O", null, null, null, null],
      "currentPlayer": "X",
      "moves": [{"position": 1, "player": "X", "timestamp": "2025-01-22T12:00:00"}],
      "winner": null
    }
  }
  ```

### 5. **GET /api/history**
Fetches the history of games the logged-in user has played.

- **Response**:
  ```json
  [
    {
      "opponent": "opponentUsername",
      "result": "X wins",
      "timeline": [
        {"position": 1, "player": "X", "timestamp": "2025-01-22T12:00:00"},
        {"position": 2, "player": "O", "timestamp": "2025-01-22T12:05:00"}
      ]
    }
  ]
  ```

### 6. **POST /api/restart-game**
Restarts an existing game.

- **Request Body**:
  ```json
  {
    "gameId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Game restarted successfully",
    "game": {
      "gameId": "string",
      "board": [null, null, null, null, null, null, null, null, null],
      "currentPlayer": "X",
      "moves": [],
      "winner": null
    }
  }

  ## Technologies Used

- **Node.js** with **Express.js**: For building the API.
- **MongoDB**: For storing user data and game states.
- **JWT**: For user authentication.
- **Mongoose**: For MongoDB object modeling.

  ```

1. [Frontend Structure](#frontend-structure)
2. [How to Use](#how-to-use)
3. [Technologies Used](#technologies-used)
4. The frontend will be available on [http://localhost:5000](http://localhost:5000).

## Frontend Structure

- **index.ejs**: The main HTML file containing the structure for user authentication, game setup, game board, and history.
- **style.css**: CSS file to style the page, game board, buttons, and forms.
- **app.js**: JavaScript file handling the logic for:
    - User registration and login
    - Starting a game and making moves
    - Displaying the game board and updating moves
    - Fetching and displaying game history

### HTML Structure Overview

- **Authentication Section (`#auth`)**:
    - **Register Form (`#register`)**: Allows new users to sign up.
    - **Login Form (`#login`)**: For existing users to log in.
    - **Game Controls (`#gameControls`)**: Allows the logged-in user to invite an opponent to start a game.

- **Game Board (`#gameBoard`)**:
    - Displays the Tic-Tac-Toe grid (3x3).
    - Allows players to click on cells to make their move.

- **Game History (`#gameHistory`)**:
    - Displays the history of previous games, including opponent details and results.

## How to Use

1. **Register a User**:
    - Fill in the "Username" and "Password" fields in the registration form and submit.

2. **Login**:
    - After registration, you can log in by entering your credentials in the login form.

3. **Start a Game**:
    - After logging in, enter the opponent's username and click "Start Game".

4. **Gameplay**:
    - Click on the cells of the Tic-Tac-Toe board to make moves. The game alternates turns between 'X' and 'O'.

5. **View Game History**:
    - After the game ends, you can fetch the game history by clicking the "Fetch Game History" button.

6. **Restart Game**:
    - Click "Restart Game" to start a new match.

    ## Technologies Used

- **HTML5**: Markup language for the structure of the web page.
- **CSS3**: Styling language for the layout and appearance of the web page and game board.
- **JavaScript**: Handles the interactive elements of the game, such as making moves and updating the board.
- **AJAX / Fetch API**: To make asynchronous requests to the backend (e.g., logging in, starting a game, making a move).


## Installation

### Prerequisites

- Node.js
- MongoDB

### Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tic-tac-toe-backend.git
   cd tic-tac-toe-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project and add the following environment variables:
   ```env
   JWT_SECRET=your_jwt_secret
   DB_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   ```

   The server will be running on `http://localhost:5000`.


## Contributing

Feel free to fork the repository and create pull requests to improve the project.

## License

This project is licensed under the MIT License.
>>>>>>> 26b262c (Initial commit)
