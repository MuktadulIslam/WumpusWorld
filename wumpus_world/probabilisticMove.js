const CaveBoard = require('./cave.js');
const { WUMPUS, PIT, STENCH } = require('./constants.js');

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

function getProbability(knowledgeBase, length, width, positionY, positionX, perceivation) {
    let temp = 0;

    if (positionY > 0 && knowledgeBase[positionY - 1][positionX][perceivation] === true) temp++;
    if (positionY + 1 < length && knowledgeBase[positionY + 1][positionX][perceivation] === true) temp++;
    if (positionX > 0 && knowledgeBase[positionY][positionX - 1][perceivation] === true) temp++;
    if (positionX + 1 < width && knowledgeBase[positionY][positionX + 1][perceivation] === true) temp++

    return temp / 4;
}

function isAdjRoomVisited(knowledgeBase, length, width, positionY, positionX) {
    if (positionY > 0 && knowledgeBase[positionY - 1][positionX].safe === true ||
        positionY + 1 < length && knowledgeBase[positionY + 1][positionX].safe === true ||
        positionX > 0 && knowledgeBase[positionY][positionX - 1].safe === true ||
        positionX + 1 < width && knowledgeBase[positionY][positionX + 1].safe === true)
        return true;
    else return false;
}

function getBestAction(probabilityArray, numberOfArrow, currentPositionY, currentPositionX) {
    console.log(probabilityArray);
    //Sorting by probability of Wumpus in descending  order and probability of Pit acending order
    let length = probabilityArray.length;

    let temp = probabilityArray[0];
    for (let i = 0; i < length; i++) {
        if (temp.pW < probabilityArray[i].pW) temp = probabilityArray[i];
    }
    // geting the best action
    if (probabilityArray[0].pW >= 0.5 && numberOfArrow > 0) {
        return { action: "SHOOT", positionY: probabilityArray[0].y, positionX: probabilityArray[0].x };
    }
    // if agent not shooting the arrow then he will make move by taking minmum risk
    else {
        let temp = probabilityArray[0];
        for (let i = 1; i < length; i++) {
            if ((temp.pW + temp.pP) == (probabilityArray[i].pW + probabilityArray[i].pP)) {
                if (Math.abs(temp.y - currentPositionY) + Math.abs(temp.x - currentPositionX) >
                    Math.abs(probabilityArray[i].y - currentPositionY) + Math.abs(probabilityArray[i].x - currentPositionX))
                    temp = probabilityArray[i];
            }
            else if ((temp.pW + temp.pP) > (probabilityArray[i].pW + probabilityArray[i].pP)) temp = probabilityArray[i];
        }

        return { action: "NO_ACTION", riskOfWumpus:temp.pW,riskOfPit:temp.pP, positionY: temp.y, positionX: temp.x };
    }
}

function addProbability(knowledgeBase) {
    let i, j;
    let length = knowledgeBase.length;
    let width = knowledgeBase[0].length;
    // const probabilityMatrix = Array.from({ length: length }, () => Array(width).fill(null));
    let probabilityArray = []

    let probailityOfWumpus = 0, probailityOfPit = 0;
    for (i = 0; i < length; i++) {
        for (j = 0; j < width; j++) {
            if (!knowledgeBase[i][j].visited && isAdjRoomVisited(knowledgeBase, length, width, i, j)) {
                probailityOfWumpus = getProbability(knowledgeBase, length, width, i, j, "stench");
                probailityOfPit = getProbability(knowledgeBase, length, width, i, j, "breeze");
                probabilityArray.push({ pW: probailityOfWumpus, pP: probailityOfPit, y: i, x: j });
            }

        }
    }
    return probabilityArray;
}

function makeProbabilisticMove(knowledgeBase, cave, numberOfArrow, currentPositionY, currentPositionX) {
    console.log("numberOfArrow=", numberOfArrow);
    CaveBoard.printCave(cave)
    printCave(knowledgeBase)

    let temp = getBestAction(addProbability(knowledgeBase), numberOfArrow, currentPositionY, currentPositionX)
    console.log("currentPositionY=", currentPositionY, "     currentPositionX=",currentPositionX)
    console.log(temp)

}

module.exports = {
    makeProbabilisticMove
}