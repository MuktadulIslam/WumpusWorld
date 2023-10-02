const constants = require('./constants.js');
const Path = require('./path.js');
const ProbabilisticMove = require('./probabilisticMove.js');
const KnowledgeBase = require('./knowledgeBase.js');

function isWumpusInAdj(cave, i, j) {
    if (
        (i > 0 && cave[i - 1][j].includes(constants.WUMPUS)) ||
        (i + 1 < cave.length && cave[i + 1][j].includes(constants.WUMPUS)) ||
        (j > 0 && cave[i][j - 1].includes(constants.WUMPUS)) ||
        (j + 1 < cave[0].length && cave[i][j + 1].includes(constants.WUMPUS))
    )
        return true;
    else
        return false;
}

function removeStench(cave, wumpusPositionY, wumpusPositionX) {
    if (wumpusPositionY + 1 < cave.length && !isWumpusInAdj(cave, wumpusPositionY + 1, wumpusPositionX))
        cave[wumpusPositionY + 1][wumpusPositionX] = cave[wumpusPositionY + 1][wumpusPositionX].filter(item => item !== constants.STENCH);

    if (wumpusPositionY > 0 && !isWumpusInAdj(cave, wumpusPositionY - 1, wumpusPositionX))
        cave[wumpusPositionY - 1][wumpusPositionX] = cave[wumpusPositionY - 1][wumpusPositionX].filter(item => item !== constants.STENCH);

    if (wumpusPositionX + 1 < cave[0].length && !isWumpusInAdj(cave, wumpusPositionY, wumpusPositionX + 1))
        cave[wumpusPositionY][wumpusPositionX + 1] = cave[wumpusPositionY][wumpusPositionX + 1].filter(item => item !== constants.STENCH);

    if (wumpusPositionX > 0 && !isWumpusInAdj(cave, wumpusPositionY, wumpusPositionX - 1))
        cave[wumpusPositionY][wumpusPositionX - 1] = cave[wumpusPositionY][wumpusPositionX - 1].filter(item => item !== constants.STENCH);

    return cave;
}

function killWumpus(cave, positionY, positionX, wumpusPositionY, wumpusPositionX) {
    let y = wumpusPositionY, x = wumpusPositionX;
    let length = cave.length;
    let width = cave[0].length;
    let actualWumpusPositionY = null, actualWumpusPositionX = null;
    // the arrow will go till it kill a wumpus or remove
    if (positionX == wumpusPositionX) {
        if (positionY < wumpusPositionY) {
            while (y < length) {
                if (cave[y][wumpusPositionX].includes(constants.WUMPUS)) {
                    actualWumpusPositionY = y;
                    break;
                }
                y++;
            }
        }
        else {
            while (y >= 0) {
                if (cave[y][wumpusPositionX].includes(constants.WUMPUS)) {
                    actualWumpusPositionY = y;
                    break;
                }
                y--;
            }
        }
        actualWumpusPositionX = wumpusPositionX;
    }
    else if (positionY == wumpusPositionY) {
        if (positionX < wumpusPositionX) {
            while (x < width) {
                if (cave[wumpusPositionY][x].includes(constants.WUMPUS)) {
                    actualWumpusPositionX = x;
                    break;
                }
                x++;
            }
        }
        else {
            while (x >= 0) {
                if (cave[wumpusPositionY][x].includes(constants.WUMPUS)) {
                    actualWumpusPositionX = x;
                    break;
                }
                x--;
            }
        }
        actualWumpusPositionY = wumpusPositionY;
    }
    else {
        console.log("Error in killWumpus() in AI_moves.js");
    }

    if (actualWumpusPositionY != null && actualWumpusPositionX != null) {
        cave[actualWumpusPositionY][actualWumpusPositionX] = cave[actualWumpusPositionY][actualWumpusPositionX].filter(item => item !== constants.WUMPUS);
        cave[actualWumpusPositionY][actualWumpusPositionX].push(constants.DEAD_WUMPUS);
        cave = removeStench(cave, actualWumpusPositionY, actualWumpusPositionX);
        if (actualWumpusPositionY == wumpusPositionY && actualWumpusPositionX == wumpusPositionX){
            return [cave, true];
        }
        else
            return [cave, false]
    }
    return [cave, null];
}

function AI_move_By_Propositional_logic(knowledgeBase, cave, numberOfArrors, currentPositionY, currentPositionX) {
    const [move, possibleActions] = ProbabilisticMove.makeProbabilisticMove(knowledgeBase, cave, numberOfArrors, currentPositionY, currentPositionX);
    if(move == null) return null;
    let direction_Action = []
    let wumpusKilled = false;

    if (move.action == "SHOOT") {
        let path = Path.generatePath(knowledgeBase, currentPositionY, currentPositionX, move.positionY, move.positionX);
        numberOfArrors--;
        const temp = killWumpus(cave, path[path.length - 1][0], path[path.length - 1][1], move.positionY, move.positionX);
        cave = temp[0];

        if(temp[1] != null) wumpusKilled = true;

        if (temp[1] == true) {
            //if wumpusis killed in adj-room
            knowledgeBase = KnowledgeBase.update(cave, knowledgeBase, move.positionY, move.positionX);
            direction_Action = Path.addDirection_Action(cave, path, true)
            direction_Action[direction_Action.length - 2].probabilityOfKilling = move.riskOfWumpus;
        } else{
            knowledgeBase[move.positionY][move.positionX].wumpusProbability = 0;
            direction_Action = Path.addDirection_Action(cave, path, true)
            direction_Action.pop();
            const length = direction_Action.length;
            // as agent make a shoot but did not make a move
            // direction_Action[length - 1].action = "SHOOT";
            direction_Action[length - 1].probabilityOfKilling = move.riskOfWumpus;
        }
    }
    else {
        // if it's a normal move
        knowledgeBase = KnowledgeBase.update(cave, knowledgeBase, move.positionY, move.positionX);
        let path = Path.generatePath(knowledgeBase, currentPositionY, currentPositionX, move.positionY, move.positionX);
        direction_Action = Path.addDirection_Action(cave, path, false)
        const length = direction_Action.length;
        direction_Action[length - 1].riskOfWumpus = move.riskOfWumpus;
        direction_Action[length - 1].riskOfPit = move.riskOfPit;
    }

    return [knowledgeBase, cave, direction_Action, possibleActions, wumpusKilled];
}

// module.exports = {
//     AI_move_By_Propositional_logic
// }
export {
    AI_move_By_Propositional_logic
}