import React from 'react';
import './Board.css'; 
import { WUMPUS, PIT, GOLD, STENCH, BREEZE } from './wumpus_world/constants';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agentPositionY: props.agentPositionY,
      agentPositionX: props.agentPositionX,
      visitedCells: [],
      board: props.board,
    };
    // this.board= storeBoard();
  }

  componentDidMount() {
    //console.log(newCave);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nextPositionY !== this.props.nextPositionY || prevProps.nextPositionX !== this.props.nextPositionX) {
      const { nextPositionY, nextPositionX } = this.props;
      const visitedCells = this.state.visitedCells.slice(); 
      const visitedCellId = `cell-${nextPositionY}-${nextPositionX}`;

      if (!visitedCells.includes(visitedCellId)) {
        visitedCells.push(visitedCellId);
      }

      this.setState({
        agentPositionY: nextPositionY,
        agentPositionX: nextPositionX,
        visitedCells: visitedCells,
      });
    }
  }

  render() {
    const { agentPositionY, agentPositionX, visitedCells } = this.state;
    const rows = this.state.board.length;
    const cols = this.state.board[0].length;
    console.log("from board" + rows + " " + cols);
    const cells = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cellId = `cell-${y}-${x}`;
        const cellContent = this.state.board[y][x];

        const isVisitedCell = visitedCells.includes(cellId);

        cells.push(
          <div
            key={cellId}
            className={`cell ${y === agentPositionY && x === agentPositionX ? 'agent' : ''}`}
            id={cellId}
          >
            {this.renderCellContent(cellContent, isVisitedCell,y === agentPositionY && x === agentPositionX)}
          </div>
        );
      }
    }

    return (
      <div className="board">
        {cells}
      </div>
    );
  }

  renderCellContent(cellData,isVisitedCell, isAgentCell) {
    const content = [];

    if (isAgentCell) {
      content.push(<img key="agent" src="/images/agent.gif" alt="Agent" className="fg" />);
    } 

    if (cellData.includes(WUMPUS) && !isAgentCell) {
      content.push(<img key="wumpus" src="/images/wumpus.gif" alt="Wumpus" className="fg"/>);
    }
    if (cellData.includes(GOLD) && !isVisitedCell) {
      content.push(<img key="gold" src="/images/gold.gif" alt="Gold" className="fg" />);
    }
    if (cellData.includes(PIT) && !isAgentCell) {
      content.push(<img key="pit" src="/images/pit.png" alt="Pit" className="fg" />);
    }
    if (cellData.includes(STENCH ) && !isAgentCell ) {
      content.push(<img key="stench" src="/images/stench1.png" alt="Stench" className="fg" />);
    }
    if (cellData.includes(BREEZE) && !isAgentCell) {
      content.push(<img key="breeze" src="/images/breeze2.png" alt="Breeze" className="fg"/>);
    }

    return content;
  }
}

export default Board;
