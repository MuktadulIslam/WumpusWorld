const CaveBoard = require('./cave.js');
const { WUMPUS, PIT } = require('./constants.js');

function printCave(knowledgeBase) {
    for (let i = 0; i < 10; i++) {
        let line = '';
        for (let j = 0; j < 10; j++) {
            let element = ''
            if (knowledgeBase[i][j].stench == true) element = element + "s=T";
            else if (knowledgeBase[i][j].stench == false) element = element + "s=F";
            else element = element + "s=N";

            if (knowledgeBase[i][j].breeze == true) element = element + " b=T";
            else if (knowledgeBase[i][j].breeze == false) element = element + " b=F";
            else element = element + " b=N";

            if (knowledgeBase[i][j].safe == true) element = element + " ss=T";
            else if (knowledgeBase[i][j].safe == false) element = element + " ss=F";
            else element = element + " ss=N";

            line = line + element.padEnd(17, " ");
        }
        console.log(line);
    }
    console.log();
}

function getWumpusProbability(knowledgeBase, length, width, positionY, positionX, Item) {
    let temp = 0;

    if (positionY > 0 && knowledgeBase[positionY - 1][positionX].stench === true) temp++;
    if (positionY + 1 < length && knowledgeBase[positionY + 1][positionX].stench === true) temp++;
    if (positionX > 0 && knowledgeBase[positionY][positionX - 1].stench === true) temp++;
    if (positionX + 1 < width && knowledgeBase[positionY][positionX + 1].stench === true) temp++

    if(temp == 4) temp = 0;     // that means all adjicent room of the wumpus is visited so it is not necessary to visit it

    return temp * 4 / 100;
}

function addProbability(knowledgeBase) {
    let i, j;
    let length = knowledgeBase.length;
    let width = knowledgeBase[0].length;
    const probabilityMatrix = Array.from({ length: length }, () => Array(width).fill(null));

    let probailityOfWumpus = 0, probailityOfPit = 0;
    for (i = 0; i < length; i++) {
        for (j = 0; j < width; j++) {
            if (knowledgeBase[i][j].safe == true) {
                probabilityMatrix[i][j] = [0, 0];
            }
            else {
                probailityOfWumpus = getWumpusProbability(knowledgeBase, length, width, i, j, WUMPUS);
                probailityOfPit = getWumpusProbability(knowledgeBase, length, width, i, j, PIT);
            }
        }
    }
    return caveMatrix;
}

function makeProbabilisticMove(knowledgeBase, cave, numberOfArrow) {
    console.log(numberOfArrow);
    CaveBoard.printCave(cave)
    printCave(knowledgeBase)
}

module.exports = {
    makeProbabilisticMove
}