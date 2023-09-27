const CaveBoard = require('./cave.js');
const { WUMPUS, PIT, STENCH } = require('./constants.js');

function printCave(knowledgeBase) {
    for (let i = 0; i < 10; i++) {
        let line = '';
        for (let j = 0; j < 10; j++) {
            let element = ''
            if (knowledgeBase[i][j].pitProbability != null) element = element + "p=" + String(knowledgeBase[i][j].pitProbability);
            else element = element + "p=N";

            if (knowledgeBase[i][j].wumpusProbability != null) element = element + " w=" + String(knowledgeBase[i][j].wumpusProbability);
            else element = element + " p=N";

            if (knowledgeBase[i][j].visited == true) element = element + " v=T";
            else element = element + " v=F";

            line = line + element.padEnd(15, " ");
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
    if (positionY > 0 && knowledgeBase[positionY - 1][positionX].visited === true ||
        positionY + 1 < length && knowledgeBase[positionY + 1][positionX].visited === true ||
        positionX > 0 && knowledgeBase[positionY][positionX - 1].visited === true ||
        positionX + 1 < width && knowledgeBase[positionY][positionX + 1].visited === true)
        return true;
    else return false;
}


function getBestAction(moveList, currentPositionY, currentPositionX) {
    let temp = moveList[0];
    const length = moveList.length;
    for (let i = 1; i < length; i++) {
        if (Math.abs(temp.positionY - currentPositionY) + Math.abs(temp.positionX - currentPositionX) >
            Math.abs(moveList[i].positionY - currentPositionY) + Math.abs(moveList[i].positionX - currentPositionX))
            temp = moveList[i];
    }
    return temp
}

function getNextActions(probabilityArray, numberOfArrow, currentPositionY, currentPositionX) {
    const length = probabilityArray.length;
    let tempList = [];

    // getting arraylist of 100% safe rooms
    for (let i = 0; i < length; i++) {
        if (probabilityArray[i].pW == 0 && probabilityArray[i].pP == 0)
            tempList.push({ action: "NO_ACTION", riskOfWumpus: 0, riskOfPit: 0, positionY: probabilityArray[i].y, positionX: probabilityArray[i].x });
    }
    if (tempList.length > 0) return getBestAction(tempList, currentPositionY, currentPositionX);

    // geting the best action by shooting the wumpus
    tempList = [];
    if (numberOfArrow > 0) {
        for (let i = 0; i < length; i++) {
            if (probabilityArray[0].pW >= 0.5) {
                if (tempList.length ==0 || probabilityArray[i].pW == tempList[0].riskOfWumpus) {
                    tempList.push({ action: "SHOOT", riskOfWumpus: probabilityArray[i].pW, riskOfPit: probabilityArray[i].pP, positionY: probabilityArray[i].y, positionX: probabilityArray[i].x });
                }
                else if (probabilityArray[i].pW > tempList[0].pW) {
                    tempList = [];
                    i--;
                }
            }
        }
    }
    if (tempList.length > 0) return getBestAction(tempList, currentPositionY, currentPositionX);

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

        return { action: "NO_ACTION", riskOfWumpus: temp.pW, riskOfPit: temp.pP, positionY: temp.y, positionX: temp.x };
    }
}

function getAllUnvisitedRoomsProbaility(knowledgeBase) {
    let i, j;
    let length = knowledgeBase.length;
    let width = knowledgeBase[0].length;
    // const probabilityMatrix = Array.from({ length: length }, () => Array(width).fill(null));
    let probabilityArray = []
    // console.log(knowledgeBase)

    for (i = 0; i < length; i++) {
        for (j = 0; j < width; j++) {
            if (!knowledgeBase[i][j].visited && isAdjRoomVisited(knowledgeBase, length, width, i, j)) {
                probabilityArray.push({ pW: knowledgeBase[i][j].wumpusProbability, pP: knowledgeBase[i][j].pitProbability, y: i, x: j });
            }

        }
    }
    return probabilityArray;
}

function makeProbabilisticMove(knowledgeBase, cave, numberOfArrow, currentPositionY, currentPositionX) {
    let temp = getAllUnvisitedRoomsProbaility(knowledgeBase);
    return getNextActions(temp, numberOfArrow, currentPositionY, currentPositionX);
}

module.exports = {
    makeProbabilisticMove
}