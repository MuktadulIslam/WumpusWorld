const constants = require('./constants.js');

function initializeKnowledgeBase(cave) {
    const length = cave.length;
    const width = cave[0].length;

    const knowledgeBase = []
    for (let i = 0; i < length; i++) {
        const temp = [];
        for (let j = 0; j < width; j++) {
            temp.push({ wumpusProbability: null, pitProbability: null, visited: false, breeze: null, stench: null })
        }
        knowledgeBase.push(temp);
    }

    knowledgeBase[0][0] = { wumpusProbability: 0, pitProbability: 0, visited: true, breeze: false, stench: false }
    return knowledgeBase;
}

function setProbability(knowledgeBase, length, width, positionY, positionX, probability, probabilityName) {
    if (positionY < length && positionY >= 0 && positionX < width && positionX >= 0 && knowledgeBase[positionY][positionX].visited == false) {
        if (probability == 0) knowledgeBase[positionY][positionX][probabilityName] = 0;
        else if (knowledgeBase[positionY][positionX][probabilityName] == null) knowledgeBase[positionY][positionX][probabilityName] = probability;
        else if (knowledgeBase[positionY][positionX][probabilityName] != 0 && knowledgeBase[positionY][positionX][probabilityName] != 1)
            knowledgeBase[positionY][positionX][probabilityName] = Number((knowledgeBase[positionY][positionX][probabilityName] + probability).toFixed(2));

        if (knowledgeBase[positionY][positionX][probabilityName] > 1) knowledgeBase[positionY][positionX][probabilityName] = 1;
    }
    return knowledgeBase
}

function addProbability(knowledgeBase, length, width, positionY, positionX) {
    let temp = 4, probability;

    if (positionY <= 0 || knowledgeBase[positionY - 1][positionX].visited == true) temp--;
    if (positionY + 1 >= length || knowledgeBase[positionY + 1][positionX].visited == true) temp--;
    if (positionX <= 0 || knowledgeBase[positionY][positionX - 1].visited == true) temp--;
    if (positionX + 1 >= width || knowledgeBase[positionY][positionX + 1].visited == true) temp--;

    if (temp == 0) probability = 0;
    else if (temp == 1) probability = 1;
    else if (temp == 2) probability = 0.5;
    else if (temp == 3) probability = 0.33;
    else { console.log("error in knowledgeBase.js") }


    if (knowledgeBase[positionY][positionX].stench == true) {
        knowledgeBase = setProbability(knowledgeBase, length, width, positionY - 1, positionX, probability, "wumpusProbability");
        knowledgeBase = setProbability(knowledgeBase, length, width, positionY + 1, positionX, probability, "wumpusProbability");
        knowledgeBase = setProbability(knowledgeBase, length, width, positionY, positionX - 1, probability, "wumpusProbability");
        knowledgeBase = setProbability(knowledgeBase, length, width, positionY, positionX + 1, probability, "wumpusProbability");
    }
    else {
        knowledgeBase = setProbability(knowledgeBase, length, width, positionY - 1, positionX, 0, "wumpusProbability");
        knowledgeBase = setProbability(knowledgeBase, length, width, positionY + 1, positionX, 0, "wumpusProbability");
        knowledgeBase = setProbability(knowledgeBase, length, width, positionY, positionX - 1, 0, "wumpusProbability");
        knowledgeBase = setProbability(knowledgeBase, length, width, positionY, positionX + 1, 0, "wumpusProbability");
    }

    if (knowledgeBase[positionY][positionX].breeze == true) {
        knowledgeBase = setProbability(knowledgeBase, length, width, positionY - 1, positionX, probability, "pitProbability");
        knowledgeBase = setProbability(knowledgeBase, length, width, positionY + 1, positionX, probability, "pitProbability");
        knowledgeBase = setProbability(knowledgeBase, length, width, positionY, positionX - 1, probability, "pitProbability");
        knowledgeBase = setProbability(knowledgeBase, length, width, positionY, positionX + 1, probability, "pitProbability");
    }
    else {
        knowledgeBase = setProbability(knowledgeBase, length, width, positionY - 1, positionX, 0, "pitProbability");
        knowledgeBase = setProbability(knowledgeBase, length, width, positionY + 1, positionX, 0, "pitProbability");
        knowledgeBase = setProbability(knowledgeBase, length, width, positionY, positionX - 1, 0, "pitProbability");
        knowledgeBase = setProbability(knowledgeBase, length, width, positionY, positionX + 1, 0, "pitProbability");
    }
    return knowledgeBase;
}


function update(cave, knowledgeBase, currentY, currentX) {
    let length = knowledgeBase.length;
    let width = knowledgeBase[0].length;
    knowledgeBase[currentY][currentX].visited = true;

    if (!(cave[currentY][currentX].includes(constants.WUMPUS) || cave[currentY][currentX].includes(constants.PIT))) {
        knowledgeBase[currentY][currentX].wumpusProbability = 0;
        knowledgeBase[currentY][currentX].pitProbability = 0;
    }

    for (let i = 0; i < length; i++) {
        for (let j = 0; j < width; j++) {
            if (knowledgeBase[i][j].visited != true) {
                if (knowledgeBase[i][j].pitProbability < 1 && knowledgeBase[i][j].pitProbability != 0)
                    knowledgeBase[i][j].pitProbability = null;
                if (knowledgeBase[i][j].wumpusProbability < 1 && knowledgeBase[i][j].wumpusProbability != 0)
                    knowledgeBase[i][j].wumpusProbability = null;
            }
        }
    }

    for (let i = 0; i < length; i++) {
        for (let j = 0; j < width; j++) {
            if (knowledgeBase[i][j].visited) {
                knowledgeBase[i][j].stench = cave[i][j].includes(constants.STENCH)
                knowledgeBase[i][j].breeze = cave[i][j].includes(constants.BREEZE)

                knowledgeBase = addProbability(knowledgeBase, length, width, i, j)
            }
        }
    }
    return knowledgeBase;
}

module.exports = {
    initializeKnowledgeBase, update
}