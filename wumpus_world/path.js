// const caveMatrix = [
//     [1, 1, 0, 0, 0],
//     [0, 1, 0, 1, 0],
//     [0, 1, 0, 1, 0],
//     [0, 1, 1, 1, 0],
//     [0, 0, 1, 0, 0],
// ];

// const start = [0, 0];
// const end = [4, 2];

function findPathByBFS(caveMatrix, startPositionY, startPositionX, destinationY, destinationX) {
    const numRows = caveMatrix.length;
    const numCols = caveMatrix[0].length;
    const visited = Array.from({ length: numRows }, () => Array(numCols).fill(false));
    const queue = [];

    // Define the possible moves (up, down, left, right)
    const rowMoves = [-1, 1, 0, 0];
    const colMoves = [0, 0, -1, 1];

    // Helper function to check if a move is valid
    function isValidMove(row, col) {
        return row >= 0 && row < numRows && col >= 0 && col < numCols && caveMatrix[row][col] !== 0 && !visited[row][col];
    }

    // Initialize the queue with the start node
    queue.push([startPositionY, startPositionX, []]);
    visited[startPositionY][startPositionX] = true;

    while (queue.length > 0) {
        const [currentRow, currentCol, path] = queue.shift();

        // Check if we've reached the end
        if (currentRow === destinationY && currentCol === destinationX) {
            return path.concat([[currentRow, currentCol]]);
        }

        // Explore adjacent cells
        for (let i = 0; i < 4; i++) {
            const newRow = currentRow + rowMoves[i];
            const newCol = currentCol + colMoves[i];

            if (isValidMove(newRow, newCol)) {
                visited[newRow][newCol] = true;
                queue.push([newRow, newCol, path.concat([[currentRow, currentCol]])]);
            }
        }
    }

    // If no path is found, return null
    return null;
}

function findSafeRooms(knowledgeBase) {
    let i, j;
    let length = knowledgeBase.length;
    let width = knowledgeBase[0].length;
    const caveMatrix = Array.from({ length: length }, () => Array(width).fill(0));

    for (i = 0; i < length; i++) {
        for (j = 0; j < width; j++) {
            if (knowledgeBase[i][j].safe == true) {
                caveMatrix[i][j] = 1;
            }
        }
    }
}


function generatePath(knowledgeBase, startPositionY, startPositionX, destinationY, destinationX) {
    let safeRooms = findSafeRooms(knowledgeBase);
    console.log(safeRooms)
}

module.exports = {
    generatePath
}