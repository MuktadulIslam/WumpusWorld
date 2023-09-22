const constants = require('./constants.js');
const caveBoard = require('./cave.js')

let knowledgeBase = null, cave = null;


function initializeKnowledgeBase() {
    let knowledgeBase = []
    for (let i = 0; i < constants.CAVE_LENGTH; i++) {
        let temp = [];
        for (let j = 0; j < constants.CAVE_WIDTH; j++) {
            temp.push(
                {
                    noWumpus: null,
                    noPit: null,
                    maybeWumpus: null,
                    maybePit: null,
                    breeze: null,
                    stench: null,
                    safe: null,
                    visited: false
                }
            )
        }
        knowledgeBase.push(temp);
    }

    knowledgeBase[0][0] = {
        noWumpus: true,
        noPit: true,
        maybeWumpus: false,
        maybePit: false,
        breeze: false,
        stench: false,
        safe: true,
        visited: false
    }

    return knowledgeBase;
}


function printCave(knowledgeBase) {
    for (let i = 0; i < 6; i++) {
        let line = '';
        for (let j = 0; j < 6; j++) {
            let element = ''
            element = element + "mw=" + String(knowledgeBase[i][j].maybeWumpus)
            element = element + "   mp=" + String(knowledgeBase[i][j].maybePit)
            element = element + "  s=" + String(knowledgeBase[i][j].safe)
            line = line + element.padEnd(35, " ");
        }
        console.log(line);
    }
    console.log();
}


function isThereWumpus(knowledgeBase, pY, pX) {
    let isThereWum = false;
    if (
        (pY <= 0 || knowledgeBase[pY - 1][pX].stench == true) &&
        (pY + 1 >= constants.CAVE_LENGTH || knowledgeBase[pY + 1][pX].stench == true) &&
        (pX <= 0 || knowledgeBase[pY][pX - 1].stench == true) &&
        (pX + 1 >= constants.CAVE_WIDTH || knowledgeBase[pY][pX + 1].stench == true)
    ) isThereWum = true;

    else if (
        // if in the upper room feels stench and that's upper, left, right sure that there is no wumpus 
        (pY > 0 && knowledgeBase[pY - 1][pX].stench == true) &&
        (pY <= 1 || knowledgeBase[pY - 2][pX].maybeWumpus == false) &&
        (pX <= 0 || knowledgeBase[pY - 1][pX - 1].maybeWumpus == false) &&
        (pX + 1 >= constants.CAVE_WIDTH || knowledgeBase[pY - 1][pX + 1].maybeWumpus == false)
    ) isThereWum = true;

    else if (
        // if in the down room feels stench and that's down, left, right sure that there is no wumpus 
        (pY + 1 < constants.CAVE_LENGTH && knowledgeBase[pY + 1][pX].stench == true) &&
        (pY + 2 >= constants.CAVE_LENGTH || knowledgeBase[pY + 2][pX].maybeWumpus == false) &&
        (pX <= 0 || knowledgeBase[pY + 1][pX - 1].maybeWumpus == false) &&
        (pX + 1 >= constants.CAVE_WIDTH || knowledgeBase[pY + 1][pX + 1].maybeWumpus == false)
    ) isThereWum = true;

    else if (
        // if in the left room feels stench and that's up, down, left sure that there is no wumpus 
        (pX > 0 && knowledgeBase[pY][pX - 1].stench == true) &&
        (pX <= 1 || knowledgeBase[pY][pX - 2].maybeWumpus == false) &&
        (pY <= 0 || knowledgeBase[pY - 1][pX - 1].maybeWumpus == false) &&
        (pY + 1 >= constants.CAVE_LENGTH || knowledgeBase[pY + 1][pX - 1].maybeWumpus == false)
    ) isThereWum = true;

    else if (
        // if in the right room feels stench and that's up, down, right sure that there is no wumpus 
        (pX + 1 < constants.CAVE_WIDTH && knowledgeBase[pY][pX + 1].stench == true) &&
        (pX + 2 >= constants.CAVE_WIDTH || knowledgeBase[pY][pX + 2].maybeWumpus == false) &&
        (pY <= 0 || knowledgeBase[pY - 1][pX + 1].maybeWumpus == false) &&
        (pY + 1 >= constants.CAVE_LENGTH || knowledgeBase[pY + 1][pX + 1].maybeWumpus == false)
    ) isThereWum = true;

    else isThereWum = false;

    return isThereWum;
}
