import React, { useState } from 'react';
import './Random.css';
import { ToastContainer, toast } from 'react-toastify';

const RandomBoardByUser = ({ onUserInput }) => {
  // Define default values for each field
  const defaultGold = 2;
  const defaultWumpus = 3;
  const defaultPit = 3;
  const defaultRow = 10;
  const defaultCol = 10;

  // Use useState with default values
  const [gold, setGold] = useState(defaultGold);
  const [wumpus, setWumpus] = useState(defaultWumpus);
  const [pit, setPit] = useState(defaultPit);
  const [row, setRow] = useState(defaultRow);
  const [col, setCol] = useState(defaultCol);

  const handleUserInput = () => {
    console.log('User Input');
    toast.success('Board Generated!', {
      position: 'top-center',
      autoClose: 2000,
  });
    // Pass default values if user input is not provided
    onUserInput({
      gold: gold || defaultGold,
      wumpus: wumpus || defaultWumpus,
      pit: pit || defaultPit,
      row: row || defaultRow,
      col: col || defaultCol,
    });
    
  };

  return (
    <div className="input-container">
      <ToastContainer />
      <label className="label-18">Number of Rows</label>
      <input type="range" id="inputNumber" min="1" max="10" step="1" onChange={(e) => setRow(e.target.value)} />
      <span>{row}</span>
      <br />
      <label className="label-18">Number of Columns</label>
      <input type="range" id="inputNumber" min="1" max="10" step="1" onChange={(e) => setCol(e.target.value)} />
      <span>{col}</span>
      <br />
      <hr />
      <label className="label-18">Number of Gold</label>
      <input className="input-18" type="number" name="gold" min="1" max="10" onChange={(e) => setGold(e.target.value)} />
      <span>{gold}</span>
      <br />
      <label className="label-18">Number of Wumpus</label>
      <input className="input-18" type="number" name="wumpus" min="1" max="10" onChange={(e) => setWumpus(e.target.value)} />
      <span>{wumpus}</span>
      <br />
      <label className="label-18">Number of Pit</label>
      <input className="input-18" type="number" name="pit" min="1" max="10" onChange={(e) => setPit(e.target.value)} />
      <span>{pit}</span>
      <hr />
      <button className="button-18" onClick={handleUserInput}>
        Generate
      </button>
    </div>
  );
};

export default RandomBoardByUser;
