function findPath(matrix, start, end) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    const visited = Array.from({ length: numRows }, () => Array(numCols).fill(false));
    const queue = [];

    // Define the possible moves (up, down, left, right)
    const rowMoves = [-1, 1, 0, 0];
    const colMoves = [0, 0, -1, 1];

    // Helper function to check if a move is valid
    function isValidMove(row, col) {
        return row >= 0 && row < numRows && col >= 0 && col < numCols && matrix[row][col] !== 0 && !visited[row][col];
    }

    // Initialize the queue with the start node
    queue.push([start[0], start[1], []]);
    visited[start[0]][start[1]] = true;

    while (queue.length > 0) {
        const [currentRow, currentCol, path] = queue.shift();

        // Check if we've reached the end
        if (currentRow === end[0] && currentCol === end[1]) {
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

// Example 2D matrix
const matrix = [
    [1, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
];

const start = [0, 0];
const end = [4, 2];

const path = findPath(matrix, start, end);
console.log(path)

if (path) {
    console.log("Path found:");
    path.forEach(([row, col]) => {
        console.log(`[${row}, ${col}]`);
    });
} else {
    console.log("No path found.");
}

