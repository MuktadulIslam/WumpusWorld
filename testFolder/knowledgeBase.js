const constants = require('./constants.js');
const CaveBoard = require('./cave.js');
const Path = require('./path.js');
const ProbabilisticMove = require('./probabilisticMove.js');

function initializeKnowledgeBase(cave) {
    const length = cave.length;
    const width = cave[0].length;

    const knowledgeBase = []
    for (let i = 0; i < length; i++) {
        const temp = [];
        for (let j = 0; j < width; j++) {
            temp.push({ wumpusProbability: null, pitProbability: null, visited: false })
        }
        knowledgeBase.push(temp);
    }

    knowledgeBase[0][0] = { wumpusProbability: 0, pitProbability: 0, visited: true }
    knowledgeBase[0][1] = { wumpusProbability: null, pitProbability: null, visited: false }
    knowledgeBase[1][0] = { wumpusProbability: null, pitProbability: null, visited: false }
    return knowledgeBase;
}

function update(cave, knowledgeBase, currentY, currentX) {
    const length = knowledgeBase.length;
    const width = knowledgeBase[0].length;

    knowledgeBase[currentY][currentX].wumpusProbability = 0;
    knowledgeBase[currentY][currentX].pitProbability = 0;
    knowledgeBase[currentY][currentX].visited = true;

    if (cave[currentY][currentX].includes(constants.BREEZE)) {
        let probValue;
        if (currentX == 0 || currentX + 1 == width || currentY == 0 || currentY == length) probValue = 0.50;
        else probValue = 0.25;

        if (currentY > 0) {
            if (knowledgeBase[currentY - 1][currentX].pitProbability == null) knowledgeBase[currentY - 1][currentX].pitProbability = probValue;
            else if (knowledgeBase[currentY - 1][currentX].pitProbability != 0) knowledgeBase[currentY - 1][currentX].pitProbability += probValue;
        }
        if (currentY + 1 < length) {
            if (knowledgeBase[currentY + 1][currentX].pitProbability == null) knowledgeBase[currentY + 1][currentX].pitProbability = probValue;
            else if (knowledgeBase[currentY + 1][currentX].pitProbability != 0) knowledgeBase[currentY + 1][currentX].pitProbability += probValue;
        }
        if (currentX > 0) {
            if (knowledgeBase[currentY][currentX - 1].pitProbability == null) knowledgeBase[currentY][currentX - 1].pitProbability = probValue;
            else if (knowledgeBase[currentY][currentX - 1].pitProbability != 0) knowledgeBase[currentY][currentX - 1].pitProbability += probValue;
        }
        if (currentX + 1 < width) {
            if (knowledgeBase[currentY][currentX + 1].pitProbability == null) knowledgeBase[currentY][currentX + 1].pitProbability = probValue;
            else if (knowledgeBase[currentY][currentX + 1].pitProbability != 0) knowledgeBase[currentY][currentX + 1].pitProbability += probValue;
        }
    }
    else {
        if (currentY > 0) knowledgeBase[currentY - 1][currentX].pitProbability = 0;
        if (currentY + 1 < length) knowledgeBase[currentY + 1][currentX].pitProbability = 0;
        if (currentX > 0) knowledgeBase[currentY][currentX-1].pitProbability = 0;
        if (currentX + 1 < width) knowledgeBase[currentY][currentX+1].pitProbability = 0;
    }

    if (cave[currentY][currentX].includes(constants.STENCH)) {
        let probValue;
        if (currentX == 0 || currentX + 1 == width || currentY == 0 || currentY == length) probValue = 0.50;
        else probValue = 0.25;

        if (currentY > 0) {
            if (knowledgeBase[currentY - 1][currentX].wumpusProbability == null) knowledgeBase[currentY - 1][currentX].wumpusProbability = probValue;
            else if (knowledgeBase[currentY - 1][currentX].wumpusProbability != 0) knowledgeBase[currentY - 1][currentX].wumpusProbability += probValue;
        }
        if (currentY + 1 < length) {
            if (knowledgeBase[currentY + 1][currentX].wumpusProbability == null) knowledgeBase[currentY + 1][currentX].wumpusProbability = probValue;
            else if (knowledgeBase[currentY + 1][currentX].wumpusProbability != 0) knowledgeBase[currentY + 1][currentX].wumpusProbability += probValue;
        }
        if (currentX > 0) {
            if (knowledgeBase[currentY][currentX - 1].wumpusProbability == null) knowledgeBase[currentY][currentX - 1].wumpusProbability = probValue;
            else if (knowledgeBase[currentY][currentX - 1].wumpusProbability != 0) knowledgeBase[currentY][currentX - 1].wumpusProbability += probValue;
        }
        if (currentX + 1 < width) {
            if (knowledgeBase[currentY][currentX + 1].wumpusProbability == null) knowledgeBase[currentY][currentX + 1].wumpusProbability = probValue;
            else if (knowledgeBase[currentY][currentX + 1].wumpusProbability != 0) knowledgeBase[currentY][currentX + 1].wumpusProbability += probValue;
        }
    }
    else {
        if (currentY > 0) knowledgeBase[currentY - 1][currentX].wumpusProbability = 0;
        if (currentY + 1 < length) knowledgeBase[currentY + 1][currentX].wumpusProbability = 0;
        if (currentX > 0) knowledgeBase[currentY][currentX-1].wumpusProbability = 0;
        if (currentX + 1 < width) knowledgeBase[currentY][currentX+1].wumpusProbability = 0;
    }

    return knowledgeBase;
}

module.exports = {
    initializeKnowledgeBase, update
}