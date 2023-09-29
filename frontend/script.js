function createChessboard() {
    const chessboard = document.getElementById("chessboard");
    const rows = parseInt(document.getElementById("boardRows").value);
    const cols = parseInt(document.getElementById("boardCols").value);

    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
        alert("Invalid input. Please enter valid numbers for rows and columns.");
        return;
    }

    chessboard.innerHTML = ""; // Clear previous chessboard

    for (let row = 0; row < rows; row++) {
        const square = document.createElement("div");
        for (let col = 0; col < cols; col++) {
            const square2 = document.createElement("div");
            // square2.className = "square";
            square2.textContent = `${row + 1}-${col + 1}`;
            chessboard.appendChild(square2);
        }
        chessboard.appendChild(square);
    }
}
