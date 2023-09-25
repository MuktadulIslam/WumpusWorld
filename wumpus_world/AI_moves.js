const constants = require('./constants.js');
const CaveBoard = require('./cave.js');
const Path = require('./path.js');

let knowledgeBase = null, cave = null, numberOfGold = 0;
let nextVisitableSquare = [];
let moveList = [];

function add_SubPath(path) {
    for (i = 0; i < path.length; i++) {
        moveList.push(path[i])
    }
}

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
    numberOfGold = CaveBoard.getTotalNumberOfGold(cave)
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

    if (positionY > 0 && cave[positionY - 1][positionX].includes(constants.WUMPUS)) temp.push(positionY - 1, positionX);
    else if (positionY + 1 < constants.CAVE_LENGTH && cave[positionY + 1][positionX].includes(constants.WUMPUS)) temp.push(positionY + 1, positionX);
    else if (positionX > 0 && cave[positionY][positionX - 1].includes(constants.WUMPUS)) temp.push(positionY, positionX - 1);
    else if (positionX + 1 < constants.CAVE_WIDTH && cave[positionY][positionX - 1].includes(constants.WUMPUS)) temp.push(positionY, positionX + 1);

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
    cave[pY][pX].push(constants.DEAD_WUMPUS);

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
    if (isThereWumpus(pY + 1, pX)) {
        killTheWumpus(pY + 1, pX);
    }
    if (isThereWumpus(pY - 1, pX)) {
        killTheWumpus(pY - 1, pX);
    }
    if (isThereWumpus(pY, pX + 1)) {
        killTheWumpus(pY, pX + 1);
    }
    if (isThereWumpus(pY, pX - 1)) {
        killTheWumpus(pY, pX - 1);
    }
}

function distenceOfTwoRooms(y1, x1, y2, x2) {
    let temp = 0;
    if (y1 > y2) temp = temp + y1 - y2;
    else temp = temp + y2 - y1;

    if (x1 > x2) temp = temp + x1 - x2;
    else temp = temp + x2 - x1;

    return temp;
}


function addSafeMoveAccordingDistence(movesArray, currentPositionY, currentPositionX) {
    if (movesArray.length == 0) return;

    let tempArray = [];
    movesArray.forEach(nextPosition => {
        let distence = distenceOfTwoRooms(nextPosition[0], nextPosition[1], currentPositionY, currentPositionX);

        tempArray.push([nextPosition[0], nextPosition[1], distence]);
    });

    let i, j, l = tempArray.length;
    for (i = 0; i < l; i++) {
        for (j = i + 1; j < l; j++) {
            if (tempArray[i][2] > tempArray[j][2]) {
                let temp = tempArray[i];
                tempArray[i] = tempArray[j];
                tempArray[j] = temp;
            }
        }
    }

    for (i = 0; i < l; i++) {
        add_as_safe_visitable_square(tempArray[i][0], tempArray[i][1]);
    }
}


function updateKnowledgeBase(pY, pX) {
    let isBreeze, isStench;
    if (cave[pY][pX].includes(constants.BREEZE)) {
        knowledgeBase[pY][pX].breeze = true;
        isBreeze = true;
    }
    else {
        knowledgeBase[pY][pX].breeze = false;
        isBreeze = false;
    }

    if (cave[pY][pX].includes(constants.STENCH)) {
        knowledgeBase[pY][pX].stench = true;
        isStench = true;
    }
    else {
        knowledgeBase[pY][pX].stench = false;
        isStench = false;
    }


    // Setting that is there may Pit in adcient room or not
    if (pY > 0 && knowledgeBase[pY - 1][pX].maybePit != false) {
        knowledgeBase[pY - 1][pX].maybePit = isBreeze;
    }
    if (pY < constants.CAVE_LENGTH - 1 && knowledgeBase[pY + 1][pX].maybePit != false) {
        knowledgeBase[pY + 1][pX].maybePit = isBreeze;
    }
    if (pX > 0 && knowledgeBase[pY][pX - 1].maybePit != false) {
        knowledgeBase[pY][pX - 1].maybePit = isBreeze;
    }
    if (pX < constants.CAVE_WIDTH - 1 && knowledgeBase[pY][pX + 1].maybePit != false) {
        knowledgeBase[pY][pX + 1].maybePit = isBreeze;
    }

    // Setting that is there may Wumpus in adcient room or not
    if (pY > 0 && knowledgeBase[pY - 1][pX].maybeWumpus != false) {
        knowledgeBase[pY - 1][pX].maybeWumpus = isStench;
    }
    if (pY < constants.CAVE_LENGTH - 1 && knowledgeBase[pY + 1][pX].maybeWumpus != false) {
        knowledgeBase[pY + 1][pX].maybeWumpus = isStench;
    }
    if (pX > 0 && knowledgeBase[pY][pX - 1].maybeWumpus != false) {
        knowledgeBase[pY][pX - 1].maybeWumpus = isStench;
    }
    if (pX < constants.CAVE_WIDTH - 1 && knowledgeBase[pY][pX + 1].maybeWumpus != false) {
        knowledgeBase[pY][pX + 1].maybeWumpus = isStench;
    }

    let tempSafeMovesArray = [];
    for (let i = 0; i < constants.CAVE_LENGTH; i++) {
        for (let j = 0; j < constants.CAVE_WIDTH; j++) {

            if (knowledgeBase[i][j].safe == null && knowledgeBase[i][j].maybePit == false && knowledgeBase[i][j].maybeWumpus == false) {
                knowledgeBase[i][j].noWumpus = true;
                knowledgeBase[i][j].noPit = true;
                knowledgeBase[i][j].safe = true;
                tempSafeMovesArray.push([i, j]);
            }
        }
    }

    addSafeMoveAccordingDistence(tempSafeMovesArray, pY, pX);
}

function AI_move_By_Propositional_logic(cave) {
    // move list will contine an object which  will be like = {pY: ,pX: ,nY: ,nX: }
    initializeKnowledgeBase();
    initializeCave(cave);
    add_SubPath([[0,0]])      // move from initial position to initial position

    add_as_safe_visitable_square(0, 0);             // as (1,1) is the current position of agent and it is safe
    let currentPositionY = 0, currentPositionX = 0;

    while (total_new_visitable_squere() > 0) {
        let temp = get_next_visitable_squere();
        let nextPositionY = temp.y, nextPositionX = temp.x;

        // moveToNextPostion(currentPositionY, currentPositionX, nextPositionY, nextPositionX);
        if (cave[nextPositionY][nextPositionX].includes(constants.GOLD)) {
            numberOfGold--;
            cave[nextPositionY][nextPositionX] = cave[nextPositionY][nextPositionX].filter(item => item !== constants.GOLD);
            cave[nextPositionY][nextPositionX].push(constants.GOLD_IS_GRABBED);
        }
        add_SubPath(Path.generatePath(knowledgeBase, currentPositionY, currentPositionX, nextPositionY, nextPositionX))

        if (cave[nextPositionY][nextPositionX].includes(constants.WUMPUS) || cave[nextPositionY][nextPositionX].includes(constants.PIT)
        || numberOfGold <= 0) {
            break;
        }

        currentPositionY = nextPositionY;
        currentPositionX = nextPositionX;
        updateKnowledgeBase(currentPositionY, currentPositionX);
        detectWumpus(currentPositionY, currentPositionX);
    }

    console.log(Path.addDirection_Action(cave, moveList))

    return moveList;
}

AI_move_By_Propositional_logic(CaveBoard.initialize())
// CaveBoard.printCave(cave)
// printCave();
// CaveBoard.printCave(CaveBoard.initialize());
// console.log(CaveBoard.numberOfGold(CaveBoard.initialize()))

module.exports = {
    AI_move_By_Propositional_logic
}

