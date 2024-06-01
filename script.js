// Initialize the arrays properly
var arr = [];
for (var i = 0; i < 9; i++) {
    arr.push([]);
    for (var j = 0; j < 9; j++) {
        arr[i].push(document.getElementById(i * 9 + j));
    }
}

var board = [];

// Function to fill the board with puzzle data
function FillBoard(board) {
    if (board && board.length > 0) {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (board[i][j] != 0) {
                    arr[i][j].innerText = board[i][j];
                } else {
                    arr[i][j].innerText = "";
                }
            }
        }
    } else {
        console.error("Empty board!");
    }
}

// Event listener for GetPuzzle button
let GetPuzzle = document.getElementById('GetPuzzle');
GetPuzzle.onclick = async function () {
    try {
        const response = await fetch('https://sudoku-api.vercel.app/api/dosuku');
        const data = await response.json();
        console.log(data); // Verify the structure

        // Access the puzzle data
        const puzzleData = data.newboard.grids[0].value;

        // Update the board array with the extracted puzzle data
        board = puzzleData;
        FillBoard(board);
    } catch (error) {
        console.error("Error fetching puzzle:", error);
    }
};

// Event listener for SolvePuzzle button
let SolvePuzzle = document.getElementById('SolvePuzzle');
SolvePuzzle.onclick = () => {
    sudokusolver(board, 0, 0, 9);
};

// Function to check if placing 'num' at position (i, j) is valid
function isvalid(board, i, j, num) {
    for (let x = 0; x < 9; x++) {
        if (board[i][x] == num) {
            return false;
        }
        if (board[x][j] == num) {
            return false;
        }
    }
    let startpointrow = i - i % 3;
    let startpointcol = j - j % 3;
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            if (board[x + startpointrow][y + startpointcol] == num) {
                return false;
            }
        }
    }
    return true;
}

// Function to solve Sudoku
async function sudokusolver(board, i, j, n) {
    if (i == n) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Add a small delay for visualization
        FillBoard(board);
        return true;
    }

    if (j == n) {
        return sudokusolver(board, i + 1, 0, n);
    }

    if (board[i][j] != 0) {
        return sudokusolver(board, i, j + 1, n);
    }

    for (let num = 1; num <= 9; num++) {
        if (isvalid(board, i, j, num)) {
            board[i][j] = num;
            await new Promise(resolve => setTimeout(resolve, 100)); // Add a small delay for visualization
            if (await sudokusolver(board, i, j + 1, n)) {
                return true;
            }
            board[i][j] = 0;
        }
    }
    return false;
};
