const constants = require('./constants.js');
const caveBoard = require('./cave.js')

let knowledgeBase = null, cave = null;
let nextVisitableSquare = [];

function add_as_safe_visitable_square(positionY, positionX) {
    try {
        nextVisitableSquare.push({ y: positionY, x: positionX });
        return true;
    }
    catch (error) {
        return false;
    }
}

function get_next_visitable_squere() {
    if (nextVisitableSquare.length > 0) return nextVisitableSquare.pop();
    else null;
}

function total_new_visitable_squere() {
    return nextVisitableSquare.length;
}

function initializeCave(caveBoard) {
    cave = caveBoard;
}

function initializeKnowledgeBase() {
    let tempKnowledgeBase = []
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
        tempKnowledgeBase.push(temp);
    }

    tempKnowledgeBase[0][0] = {
        noWumpus: true,
        noPit: true,
        maybeWumpus: false,
        maybePit: false,
        breeze: false,
        stench: false,
        safe: true,
        visited: true
    }

    knowledgeBase = tempKnowledgeBase;
}

function printCave() {
    for (let i = 0; i < 10; i++) {
        let line = '';
        for (let j = 0; j < 10; j++) {
            let element = ''
            if (knowledgeBase[i][j].maybeWumpus == true) element = element + "mw=T";
            else if (knowledgeBase[i][j].maybeWumpus == false) element = element + "mw=F";
            else element = element + "mw=N";

            if (knowledgeBase[i][j].maybePit == true) element = element + " mp=T";
            else if (knowledgeBase[i][j].maybePit == false) element = element + " mp=F";
            else element = element + " mp=N";

            if (knowledgeBase[i][j].safe == true) element = element + " s=T";
            else if (knowledgeBase[i][j].safe == false) element = element + " s=F";
            else element = element + " s=N";

            line = line + element.padEnd(17, " ");
        }
        console.log(line);
    }
    console.log();
}

function remove_stench_from_adjicent_room(pY, pX) {
    knowledgeBase[pY][pX].stench = false;

    if (pY > 0) knowledgeBase[pY - 1][pX].maybeWumpus = false;
    if (pY + 1 < constants.CAVE_LENGTH) knowledgeBase[pY + 1][pX].maybeWumpus = false;
    if (pX > 0) knowledgeBase[pY][pX - 1].maybeWumpus = false;
    if (pX + 1 < constants.CAVE_WIDTH) knowledgeBase[pY][pX + 1].maybeWumpus = false;
}

function isAnotherWumpusInAdj(positionY, positionX) {
    let temp = [];

    if (positionY > 0 && cave[positionY - 1][positionX] == constants.WUMPUS) temp.push(positionY - 1, positionX);
    if (positionY + 1 < constants.CAVE_LENGTH && cave[positionY + 1][positionX] == constants.WUMPUS) temp.push(positionY + 1, positionX);
    if (positionX > 0 && cave[positionY][positionX - 1] == constants.WUMPUS) temp.push(positionY, positionX - 1);
    if (positionX + 1 < constants.CAVE_WIDTH && cave[positionY][positionX - 1] == constants.WUMPUS) temp.push(positionY, positionX + 1);

    if (temp.length > 1)
        return true;
    else
        return false;
}

function removeWumpusFrom_KnowledgeBase(pY, pX) {
    knowledgeBase[pY][pX].noWumpus = true;
    knowledgeBase[pY][pX].noPit = true;
    knowledgeBase[pY][pX].safe = true;
    knowledgeBase[pY][pX].maybePit = false;
    knowledgeBase[pY][pX].maybeWumpus = false;

    // Removing the stench from adjicent rooms in Knowledge Base
    if ((pY > 0) && !cave[pY - 1][pX].includes(constants.STENCH)) {
        remove_stench_from_adjicent_room(pY - 1, pX);
    }
    if ((pY + 1 < constants.CAVE_LENGTH) && !cave[pY + 1][pX].includes(constants.STENCH)) {
        remove_stench_from_adjicent_room(pY + 1, pX);
    }
    if ((pX > 0) && !cave[pY][pX - 1].includes(constants.STENCH)) {
        remove_stench_from_adjicent_room(pY, pX - 1);
    }
    if ((pX + 1 < constants.CAVE_WIDTH) && !cave[pY][pX + 1].includes(constants.STENCH)) {
        remove_stench_from_adjicent_room(pY, pX + 1);
    }
}

function removeWumpusFrom_Cave(pY, pX) {

    cave[pY][pX] = cave[pY][pX].filter(item => item !== constants.WUMPUS);

    if (pY > 0 && !isAnotherWumpusInAdj(pY - 1, pX))
        cave[pY - 1][pX] = cave[pY - 1][pX].filter(item => item !== constants.STENCH);
    if (pY + 1 < constants.CAVE_LENGTH && !isAnotherWumpusInAdj(pY + 1, pX))
        cave[pY + 1][pX] = cave[pY + 1][pX].filter(item => item !== constants.STENCH);
    if (pX > 0 && !isAnotherWumpusInAdj(pY, pX - 1))
        cave[pY][pX - 1] = cave[pY][pX - 1].filter(item => item !== constants.STENCH);
    if (pX + 1 < constants.CAVE_WIDTH && !isAnotherWumpusInAdj(pY, pX + 1))
        cave[pY][pX + 1] = cave[pY][pX + 1].filter(item => item !== constants.STENCH);
}

function killTheWumpus(pY, pX) {
    removeWumpusFrom_Cave(pY, pX);
    removeWumpusFrom_KnowledgeBase(pY, pX)
    add_as_safe_visitable_square(pY, pX)
}


function isThereWumpus(pY, pX) {
    if (pY >= constants.CAVE_LENGTH || pY < 0 || pX >= constants.CAVE_WIDTH || pX < 0 || knowledgeBase[pY][pX].safe == true) return false;
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

function detectWumpus(pY, pX) {
    if(isThereWumpus(pY + 1, pX)) {
        killTheWumpus(pY + 1, pX);
    }
    if(isThereWumpus(pY - 1, pX)) {
        killTheWumpus(pY - 1, pX);
    }
    if(isThereWumpus(pY, pX + 1)) {
        killTheWumpus(pY, pX + 1);
    }
    if(isThereWumpus(pY, pX - 1)) {
        killTheWumpus(pY, pX - 1);
    }
}


