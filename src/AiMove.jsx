import React, { Component } from 'react';
import { getTotalNumberOfGold, getTotalNumberOfWumpus, storeBoard } from './wumpus_world/cave';
import { AI_move_By_Propositional_logic } from './wumpus_world/AI_moves';
import { initializeKnowledgeBase, update } from './wumpus_world/knowledgeBase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Board from './Board';
import MainBoard from './MainBoard';
import './AiMove.css';
import ProbabilityBoard from './ProbabilityBoard';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa'; // Import Font Awesome icons

import grabSound from './sounds/grab.wav';
import gameOver from './sounds/game-over.wav';
import win from './sounds/win.wav';
import kill from './sounds/kill.wav';
import move from './sounds/move.wav';
import miss from './sounds/miss.wav';

class AgentMoves extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moves: [],
            prevPositionY: 0,
            prevPositionX: 0,
            currentPositionY: 0,
            currentPositionX: 0,
            collectedGold: 0,
            numberOfArrows: 0,
            knowledgeBase: null,
            totalPoint: 100,
            possibleActions: [],
            isMuted: false,
        };
        this.board = storeBoard();
        this.knowledgeBase = null;
        this.hasMounted = false;
        this.continueUpdating = true;
        this.grabAudio = new Audio(grabSound);
        this.gameOver = new Audio(gameOver);
        this.kill = new Audio(kill);
        this.win = new Audio(win);
        this.move = new Audio(move);
        this.miss = new Audio(miss);
    }

    calculatePoint(action, grab) {
        let points = 0;
        if (grab) {
            points += 1000;
        }
        if (action === 'SHOOT') {
            points -= 10;
        } else if (action !== 'SHOOT') {
            points -= 1;
        }

        return points;
    }

    toggleMute = () => {
        const audioElements = [this.grabAudio, this.gameOver, this.kill, this.win, this.move, this.miss];
    
        audioElements.forEach((audioElement) => {
          audioElement.muted = !this.state.isMuted;
        });
    
        this.setState((prevState) => ({
          isMuted: !prevState.isMuted,
        }));
      };

    async componentDidMount() {
        const board = document.querySelector('.board');
        board.style.gridTemplateColumns = `repeat(${this.board[0].length}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${this.board.length}, 1fr)`;

        try {
            if (!this.hasMounted) {
                this.hasMounted = true;
                this.knowledgeBase = initializeKnowledgeBase(this.board);
                let numberOfArrows = getTotalNumberOfWumpus(this.board, this.board.length, this.board[0].length);
                const maximumGold = getTotalNumberOfGold(this.board, this.board.length, this.board[0].length);
                let collectedGold = 0;
                let totalPoint = 100;

                this.knowledgeBase = update(this.board, this.knowledgeBase, 0, 0);
                let nextPositionY = 0;
                let nextPositionX = 0;

                while (this.continueUpdating) {
                    console.log(nextPositionY, nextPositionX)
                    const [
                        updatedKnowledgeBase,
                        updatedCave,
                        allMoves,
                        possibleActions,
                        isWumpusKilled,
                    ] = AI_move_By_Propositional_logic(
                        this.knowledgeBase,
                        this.board,
                        numberOfArrows,
                        nextPositionY,
                        nextPositionX
                    );

                    this.knowledgeBase = updatedKnowledgeBase;
                    // console.log(this.knowledgeBase);
                    this.board = updatedCave;
                    const totalMoves = allMoves.length;
                    this.knowledgeBase = updatedKnowledgeBase;
                    for (let i = 0; i < totalMoves; i++) {
                        await new Promise((resolve) => setTimeout(resolve, 1200)); // Wait for .5 second

                        const currentState = allMoves[i];

                        if (currentState.action === 'SHOOT') {
                            numberOfArrows--;
                            totalPoint -= 10;
                            if (isWumpusKilled) {
                                totalPoint += 1000;
                                this.kill.play();
                                toast.success('Wumpus is killed', {
                                    position: 'top-center',
                                    autoClose: 2000,
                                });
                            }
                            else { this.miss.play(); }
                        }
                        this.move.play();
                        if ((i + 1) == allMoves) break;
                        if (currentState.move === 'RIGHT') {
                            nextPositionX++;
                            totalPoint--;
                        } else if (currentState.move === 'LEFT') {
                            nextPositionX--;
                            totalPoint--;
                        } else if (currentState.move === 'UP') {
                            nextPositionY--;
                            totalPoint--;
                        } else if (currentState.move === 'DOWN') {
                            nextPositionY++;
                            totalPoint--;
                        }

                        
                        if (currentState.grab) {
                            this.grabAudio.play();
                            toast.success('Gold is grabbed!', {
                                position: 'top-center',
                                autoClose: 2000,
                            });
                            collectedGold++;
                            totalPoint += 1000;

                        }
                        this.setState({
                            moves: allMoves,
                            prevPositionY: this.state.currentPositionY,
                            prevPositionX: this.state.currentPositionX,
                            currentPositionY: nextPositionY,
                            currentPositionX: nextPositionX,
                            collectedGold: collectedGold,
                            numberOfArrows: numberOfArrows,
                            knowledgeBase: updatedKnowledgeBase,
                            totalPoint: totalPoint,
                            possibleActions: allMoves,
                        });
                    }
                    console.log(allMoves[totalMoves - 2].action);
                    console.log(nextPositionY, nextPositionX)
                    if (collectedGold === maximumGold) {
                        this.win.play();
                        this.continueUpdating = false;
                        toast.success('You won!', {
                            position: 'top-center',
                            autoClose: 2000,
                        });
                    }
                    if (allMoves[totalMoves - 1].action === 'DIE') {
                        console.log(allMoves[totalMoves - 1],allMoves[totalMoves - 2]);
                        this.gameOver.play();
                        this.continueUpdating = false;
                        toast.error('Agent died with collected gold'+collectedGold, {
                            position: 'top-center',
                            autoClose: 2000,
                        });
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const possibleActionsText = this.state.possibleActions.map(action => `${action.action} - ${action.move}`).join(', ');

        return (
            <>
                <ToastContainer />
                <div className='d-flex flex-row justify-content-between align-items-center aimove'>
                    <div className="first-div">
                        <div className='possible-action'>
                            <p style={{fontSize: "20px"}}>Current State</p>
                            <p style={{fontSize: "12px"}}>Current Position: ({this.state.currentPositionY}, {this.state.currentPositionX})</p>
                            <p style={{fontSize: "12px"}}>Collected Gold: {this.state.collectedGold}</p>
                            <p style={{fontSize: "12px"}}>Number of possible Moves: {this.state.moves.length}</p>
                            <p style={{fontSize: "12px"}} >Total Points: {this.state.totalPoint}</p>
                            <p style={{fontSize: "12px"}}>Number of Arrows: {this.state.numberOfArrows}</p>
                        </div>
                        <div className='all-action'>
                            <p style={{fontSize: "20px"}}>All Actions:</p>
                            <p style={{fontSize: "12px"}}>{possibleActionsText}<br/></p>
                        </div>
                    </div>
                    <div className="second-div">
                        <div className='Board'>
                            <p style={{fontSize: "20px", fontWeight: "bold", textAlign: "left"}}>Inspection Board</p>
                            <Board
                                agentPositionY={this.state.prevPositionY}
                                agentPositionX={this.state.prevPositionX}
                                nextPositionY={this.state.currentPositionY}
                                nextPositionX={this.state.currentPositionX}
                                grab={this.state.moves.grab}
                                board={this.board}
                            />
                        </div>
                        {this.state.knowledgeBase !== null && (
                            <div className='PBoard'>
                                <p style={{fontSize: "20px", color: "white"}}>Probability Board</p>
                                <ProbabilityBoard knowledgeBase={this.state.knowledgeBase} board={this.board} />
                            </div>
                        )}
                    </div>
                    <div className="third-div">
                    <p style={{fontSize: "20px", fontWeight: "bold", textAlign: "left"}}>Main Board</p>
                        <MainBoard  agentPositionY={this.state.prevPositionY}
                                    agentPositionX={this.state.prevPositionX}
                                    nextPositionY={this.state.currentPositionY}
                                    nextPositionX={this.state.currentPositionX}
                                    grab={this.state.moves.grab}
                                    board={this.board}/>
                    </div>
                </div><br />
                <div><button className="volume-control button-18" onClick={this.toggleMute}>
            {this.state.isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            {this.state.isMuted ? 'Unmute' : 'Mute'}
          </button></div>
            </>
        );
    }
}

export default AgentMoves;

/*
<div className='d-flex flex-row justify-content-between align-items-center aimove'>
                    <div className=''>
                        <h2>Agent Moves</h2>
                        <p>Current Position: ({this.state.currentPositionY}, {this.state.currentPositionX})</p>
                        <p>Collected Gold: {this.state.collectedGold}</p>
                        <p>Number of possible Moves: {this.state.moves.length}</p>
                        <p>All Moves: {possibleActionsText}</p>
                        <p>Total Points: {this.state.totalPoint}</p>
                    </div>
                    <div>
                        <div className='Board'>
                            <h3>Inspection Board</h3>
                            <Board
                                agentPositionY={this.state.prevPositionY}
                                agentPositionX={this.state.prevPositionX}
                                nextPositionY={this.state.currentPositionY}
                                nextPositionX={this.state.currentPositionX}
                                grab={this.state.moves.grab}
                                board={this.board}
                            />
                        </div>
                        {this.state.knowledgeBase !== null && (
                            <div className='PBoard'>
                                <h3>Probability Board</h3>
                                <ProbabilityBoard knowledgeBase={this.state.knowledgeBase} board={this.board} />
                            </div>
                        )}
                    </div>

                    <div className='MainBoard'>
                        <h3>Main Board</h3><MainBoard
                        agentPositionY={this.state.prevPositionY}
                        agentPositionX={this.state.prevPositionX}
                        nextPositionY={this.state.currentPositionY}
                        nextPositionX={this.state.currentPositionX}
                        grab={this.state.moves.grab}
                        board={this.board}
                    />
                    </div>
                </div>
                */