import React from 'react';
import Papa from 'papaparse';
import { board_data} from './wumpus_world/cave.js'
import { GOLD, PIT, WUMPUS } from './wumpus_world/constants.js';

const CSVParser = ({onDataParsed}) => {
  const textparseascsv = async(text) => {
    let data_rows = [];
    let data_cols = [];
    let data = [];
    const rows = text.split('\n');
    for (let i = 0; i < rows.length; i++) {
      for(let j = 0; j < rows[i].length; j++) {
        if (rows[i][j] === 'W') {
          data_cols.push(WUMPUS);
        } else if (rows[i][j] === 'P') {
          data_cols.push(PIT);
        } else if (rows[i][j] === 'G') {
          data_cols.push(GOLD);
        } else {
          data_cols.push(null);
        }
      }
      data_rows.push(data_cols);
      data_cols = [];
    }
    data.push(data_rows);
    
    return data_rows;
  }



  const handleFileUpload = async(event) => {
    const file = event.target.files[0];

    if(file.name.endsWith('.txt')) {
      let data = [];
      console.log('Text file detected');
      const reader = new FileReader();

      reader.onload =async(e) => {
        const text = e.target.result;        
        data =await textparseascsv(text);
        onDataParsed(data);
         board_data(data);
      };

      reader.readAsText(file);
    }

    if (file.name.endsWith('.csv') ) {
      console.log('CSV file detected');
      const reader = new FileReader();

      reader.onload = (e) => {
        const csvText = e.target.result;

        Papa.parse(csvText, {
          complete: (result) => {
            onDataParsed(result.data);
            board_data(result.data);
          },
          header: false, // Set to true if CSV has header row
        });
      };

      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv, .txt" onChange={handleFileUpload}/>
    </div>
  );
};

export default CSVParser;
