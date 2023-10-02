import { WUMPUS, PIT, AGENT, GOLD, STENCH, BREEZE } from './constants.js';

var generated_cave = [];
var final_cave=[];
var row = 10;
var col = 10;
var gold = 0;
var wumpus = 0;
var pit = 0;

 function addPerceivation(cave, cave_length, cave_width) {
    let newCave = [];
    for (let i = 0; i < cave_length; i++) {
        let tempRow = []
        for (let j = 0; j < cave_width; j++) {
            let temp = [];
            if (cave[i][j]  !== WUMPUS && cave[i][j] !== PIT  && isWumpusInAdj(cave,cave_length,cave_width, i, j)) {
                temp.push(STENCH);
            }
            if (cave[i][j]  !==  WUMPUS && cave[i][j] !==PIT  && isPitInAdj(cave,cave_length,cave_width, i, j)) {
                temp.push(BREEZE);
            }
            if (cave[i][j] === GOLD) {
                temp.push(GOLD);
            }
            if (cave[i][j] === WUMPUS) {
                temp.push(WUMPUS);
            }
            if (cave[i][j] === PIT) {
                temp.push(PIT);
            }

            tempRow.push(temp);
        }
        newCave.push(tempRow);
    }
    if(newCave.length>0) newCave[0][0] = [AGENT];
    return newCave;
}

 function board_data(data){
    generated_cave= addPerceivation(data, row, col);
    console.log(generated_cave);
    return generated_cave;
}

 function initialize() {
    return randomCaveGeneration(row, col, gold, wumpus, pit);
}

 function getTotalNumberOfGold(cave, cave_length, cave_width) {
    let temp = 0;
    for (let i = 0; i < cave_length; i++) {
        for (let j = 0; j < cave_width; j++) {
            if (cave[i][j].includes(GOLD)) {
                temp++;
            }
        }
    }
    return temp;
}

 function getTotalNumberOfWumpus(cave, cave_length, cave_width) {
    let temp = 0;
    for (let i = 0; i < cave_length; i++) {
        for (let j = 0; j < cave_width; j++) {
            if (cave[i][j].includes(WUMPUS)) {
                temp++;
            }
        }
    }
    return temp;
}

 function printCave(cave, cave_length, cave_width) {
    for (let i = 0; i < cave_length; i++) {
        let line = '';
        for (let j = 0; j < cave_width; j++) {
            let element = "[" + String(cave[i][j]) + "]"
            line = line + element.padEnd(15, " ");
        }
        console.log(line);
    }
    console.log();
}


 function isWumpusInAdj(cave, cave_length, cave_width, i, j) {
    if (
        (i > 0 && cave[i - 1][j] === WUMPUS) ||
        (i < cave_length - 1 && cave[i + 1][j] === WUMPUS) ||
        (j > 0 && cave[i][j - 1] === WUMPUS) ||
        (j < cave_width - 1 && cave[i][j + 1] === WUMPUS)
    )
        return true;
    else
        return false;
}

 function isPitInAdj(cave, cave_length, cave_width, i, j) {
    if (
        (i > 0 && cave[i - 1][j] === PIT) ||
        (i < cave_length - 1 && cave[i + 1][j] === PIT) ||
        (j > 0 && cave[i][j - 1] === PIT) ||
        (j < cave_width - 1 && cave[i][j + 1] === PIT)
    )
        return true;
    else
        return false;
}

function randomCaveGeneration(cave_length, cave_width, numberOfGold, numberOfWumpus, numberOfPit) {
    let newCave = Array.from({ length: cave_length }, () => {
        return Array.from({ length: cave_width }, () => null);
    });
    let y, x, maximumItem = cave_length * cave_width;

    // Assigning Gold
    for (let i = 0; i < numberOfGold; i++) {
        if (maximumItem <= 0) break;

        [y, x] = getRandomCoordinate(newCave, cave_length, cave_width);
        newCave[y][x] = GOLD;
        maximumItem--;
    }
    // Assigning Wumpus
    for (let i = 0; i < numberOfWumpus; i++) {
        if (maximumItem <= 0) break;

        [y, x] = getRandomCoordinate(newCave, cave_length, cave_width);
        newCave[y][x] = WUMPUS
    }
    // Assigning Pit
    for (let i = 0; i < numberOfPit; i++) {
        if (maximumItem <= 0) break;

        [y, x] = getRandomCoordinate(newCave, cave_length, cave_width);
        newCave[y][x] = PIT
    }

    newCave[0][0] = AGENT;
    return addPerceivation(newCave,cave_length,cave_width);
}



 function getRandomCoordinate(cave, cave_length, cave_width) {
    const y = Math.floor(Math.random() * cave_length);
    const x = Math.floor(Math.random() * cave_width);

    if (cave[y][x] != null || (y === 1 && x === 0) || (y === 0 && x === 1) || (y === 0 && x === 0)) {
        return getRandomCoordinate(cave, cave_length,cave_width);
    }
    else return [y,x];
}


 function getBoard(){
    final_cave= initialize();
}

function getCSVBoard(data){
    final_cave= board_data(data);
}
function storeBoard(){
    return final_cave;
}

 function setValues(g,w,p){
    gold=g;
    wumpus=w;
    pit=p;
}

 function setRowCol(r,c){
    row=r;
    col=c;
}

function setBoard(board){
    final_cave=addPerceivation(board,row,col);
}

export {
    printCave,setBoard,getCSVBoard,board_data,storeBoard, initialize,setRowCol, setValues, isPitInAdj, isWumpusInAdj,getBoard, getTotalNumberOfGold, getTotalNumberOfWumpus, randomCaveGeneration
}
