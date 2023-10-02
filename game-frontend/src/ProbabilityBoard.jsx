import React, { Component } from 'react';

class ProbabilityBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            knowledgeBase: props.knowledgeBase,
            board: props.board,
          };
      }
  render() {
    const numRows = this.state.board.length;
    const numCols = this.state.board[0].length;
    console.log(this.props);

    // Initialize a new board with all cells having both Wumpus and Pit probabilities set to 0
    const initialBoard = Array(numRows)
      .fill()
      .map(() => Array(numCols).fill({ wumpus: 0, pit: 0 }));

    // Update the probabilities in the initial board based on knowledgeBase
    this.state.knowledgeBase.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        initialBoard[rowIndex][colIndex] = {
          wumpus: cell.wumpusProbability,
          pit: cell.pitProbability,
        };
      });
    });

    return (
      <div className="probability-board"  style={{maxHeight: '50%'}}>
        <table >
          <tbody>
            {initialBoard.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cellValues, colIndex) => (
                  <td key={colIndex}>
                    {/* Render the probabilities for Wumpus and Pit */}
                    <div>
                      W: {cellValues.wumpus}<br/>
                      P: {cellValues.pit}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ProbabilityBoard;
