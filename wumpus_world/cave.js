const { WUMPUS, PIT, AGENT, GOLD, CAVE_LENGTH, CAVE_WIDTH, STENCH, BREEZE } = require('./constants.js')


function addPerceivation(cave) {
    let newCave = [];
    for (let i = 0; i < CAVE_LENGTH; i++) {
        let tempRow = []
        for (let j = 0; j < CAVE_WIDTH; j++) {
            let temp = [];
            if (isWumpusInAdj(cave, i, j)) {
                temp.push(STENCH);
            }
            if (isPitInAdj(cave, i, j)) {
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

    // let cave = [
    //     [AGENT, null, null, null, null, null, null, null, null, null],
    //     [null, null, WUMPUS, null, null, null, null, null, null, null],
    //     [null, null, null, null, null, null, null, null, null, null],
    //     [WUMPUS, null, PIT, null, null, null, null, WUMPUS, null, null],
    //     [null, null, WUMPUS, null, null, WUMPUS, null, null, null, null],
    //     [null, GOLD, null, null, null, null, null, null, null, null],
    //     [null, null, null, PIT, null, null, null, null, null, GOLD],
    //     [null, WUMPUS, null, null, PIT, null, null, null, null, PIT],
    //     [WUMPUS, null, null, PIT, null, null, null, null, PIT, null],
    //     [PIT, GOLD, null, null, GOLD, null, null, WUMPUS, null, null]
    // ];

    // return cave
    return addPerceivation(cave);
}

function getTotalNumberOfGold(cave) {
    let temp = 0;
    for (let i = 0; i < CAVE_LENGTH; i++) {
        for (let j = 0; j < CAVE_WIDTH; j++) {
            if (cave[i][j].includes(GOLD)) {
                temp++;
            }
        }
    }
    return temp;
}

function getTotalNumberOfWumpus(cave) {
    let temp = 0;
    for (let i = 0; i < CAVE_LENGTH; i++) {
        for (let j = 0; j < CAVE_WIDTH; j++) {
            if (cave[i][j].includes(WUMPUS)) {
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
        (i < CAVE_LENGTH - 1 && cave[i + 1][j] === WUMPUS) ||
        (j > 0 && cave[i][j - 1] === WUMPUS) ||
        (j < CAVE_WIDTH - 1 && cave[i][j + 1] === WUMPUS)
    )
        return true;
    else
        return false;
}

function isPitInAdj(cave, i, j) {
    if (
        (i > 0 && cave[i - 1][j] === PIT) ||
        (i < CAVE_LENGTH - 1 && cave[i + 1][j] === PIT) ||
        (j > 0 && cave[i][j - 1] === PIT) ||
        (j < CAVE_WIDTH - 1 && cave[i][j + 1] === PIT)
    )
        return true;
    else
        return false;
}

function randomCaveGeneration(numberOfGold, numberOfWumpus, numberOfPit) {
    let newCave = Array.from({ length: CAVE_LENGTH }, () => Array(CAVE_WIDTH).fill(null));
    let y,x;

    // Assigning Gold
    for (let i = 0; i < numberOfGold; i++) {
        [y,x] = getRandomCoordinate(newCave, CAVE_LENGTH, CAVE_WIDTH);
        newCave[y][x] = GOLD
    }
    // Assigning Wumpus
    for (let i = 0; i < numberOfWumpus; i++) {
        [y,x] = getRandomCoordinate(newCave, CAVE_LENGTH, CAVE_WIDTH);
        newCave[y][x] = WUMPUS
    }
    // Assigning Pit
    for (let i = 0; i < numberOfPit; i++) {
        [y,x] = getRandomCoordinate(newCave, CAVE_LENGTH, CAVE_WIDTH);
        newCave[y][x] = PIT
    }

    newCave[0][0] = AGENT;
    return addPerceivation(newCave)
}

function getRandomCoordinate(cave, cave_length, cave_width) {
    const y = Math.floor(Math.random() * cave_length);
    const x = Math.floor(Math.random() * cave_width);

    if (cave[y][x] != null || (y === 1 && x === 0) || (y === 0 && x === 1) || (y === 0 && x === 0)) {
        return getRandomCoordinate(cave, cave_length,cave_width);
    }
    else return [y,x];
}

module.exports = {
    printCave, initialize, isPitInAdj, isWumpusInAdj, getTotalNumberOfGold, getTotalNumberOfWumpus, randomCaveGeneration
}
