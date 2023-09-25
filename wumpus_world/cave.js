const { WUMPUS, PIT, AGENT, GOLD, CAVE_LENGTH, CAVE_WIDTH, STENCH, BREEZE } = require('./constants.js')


function addPerceivation(cave) {
    let newCave = [];
    for(let i=0;i<CAVE_LENGTH;i++) {
        let tempRow = []
        for(let j=0;j<CAVE_WIDTH;j++) {
            let temp = [];
            if (isWumpusInAdj(cave, i, j)) {
                temp.push(STENCH);
            }
            if (isPitInAdj(cave, i, j)) {
                temp.push(BREEZE);
            }
            if(cave[i][j] === GOLD){
                temp.push(GOLD);
            }
            if(cave[i][j] === WUMPUS){
                temp.push(WUMPUS);
            }
            if(cave[i][j] === PIT){
                temp.push(PIT);
            }

            tempRow.push(temp);
        }
        newCave.push(tempRow);
    }
    newCave[0][0] = [AGENT];
    return newCave;
}


function initialize() {
    let cave = [
        [AGENT, null, WUMPUS, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, WUMPUS, null],
        [PIT, null, WUMPUS, null, PIT, null, GOLD, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, WUMPUS, null, null, null, null, null, PIT, null],
        [null, null, null, GOLD, null, null, WUMPUS, null, null, null],
        [null, null, null, null, null, null, null, null, null, WUMPUS],
        [null, PIT, null, null, null, null, null, null, null, null],
        [null, null, null, GOLD, null, null, null, GOLD, null, null],
        [null, null, null, null, null, PIT, null, null, PIT, null]
    ];

    // return cave
    return addPerceivation(cave);
}

function getTotalNumberOfGold(cave) {
    let temp=0;
    for(let i=0;i<CAVE_LENGTH;i++) {
        for(let j=0;j<CAVE_WIDTH;j++) {
            if (cave[i][j].includes(GOLD)){
                temp++;
            }
        }
    }
    return temp;
}

function getTotalNumberOfWumpus(cave) {
    let temp=0;
    for(let i=0;i<CAVE_LENGTH;i++) {
        for(let j=0;j<CAVE_WIDTH;j++) {
            if (cave[i][j].includes(WUMPUS)){
                temp++;
            }
        }
    }
    return temp;
}

function printCave(cave) {
    for (let i = 0; i < CAVE_LENGTH; i++) {
        let line = '';
        for (let j = 0; j < CAVE_WIDTH; j++) {
            let element = "[" + String(cave[i][j]) + "]"
            line = line + element.padEnd(15, " ");
        }
        console.log(line);
    }
    console.log();
}


function isWumpusInAdj(cave, i, j) {
    if (
        (i > 0 && cave[i - 1][j] === WUMPUS) ||
        (i < CAVE_LENGTH-1 && cave[i + 1][j] === WUMPUS) ||
        (j > 0 && cave[i][j - 1] === WUMPUS) ||
        (j < CAVE_WIDTH-1 && cave[i][j + 1] === WUMPUS)
    )
        return true;
    else
        return false;
}

function isPitInAdj(cave, i, j) {
    if (
        (i > 0 && cave[i - 1][j] === PIT) ||
        (i < CAVE_LENGTH-1 && cave[i + 1][j] === PIT) ||
        (j > 0 && cave[i][j - 1] === PIT) ||
        (j < CAVE_WIDTH-1 && cave[i][j + 1] === PIT)
    )
        return true;
    else
        return false;
}

module.exports = {
    printCave, initialize, isPitInAdj, isWumpusInAdj, getTotalNumberOfGold, getTotalNumberOfWumpus
}
