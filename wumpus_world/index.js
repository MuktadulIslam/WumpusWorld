const CaveBoard = require('./cave.js');
const Move = require('./AI_moves.js')
const KnowledgeBase = require('./knowledgeBase.js')


let cave = CaveBoard.randomCaveGeneration(4, 8, 7)
// let cave = CaveBoard.initialize()
// CaveBoard.printCave(cave)
let knowledgeBase = KnowledgeBase.initializeKnowledgeBase(cave)
let numberOfArrors = CaveBoard.getTotalNumberOfWumpus(cave)
const maximumGold = CaveBoard.getTotalNumberOfGold(cave);
let collectedGold = 0;
let totalPoint = 0;

knowledgeBase = KnowledgeBase.update(cave, knowledgeBase, 0, 0);
let nextPositionY = 0;
let nextPositionX = 0;
console.log(nextPositionY, nextPositionX);
while (true) {

    let temp = Move.AI_move_By_Propositional_logic(knowledgeBase, cave, numberOfArrors, nextPositionY, nextPositionX);

    //Updating knowledgebase & cave
    knowledgeBase = temp[0];
    cave = temp[1];
    const allMoves = temp[2];
    const totalMoves = allMoves.length;
    const possibleActions = temp[3];
    console.log(possibleActions);

    for (let i = 0; i < totalMoves; i++) {
        const currentState = allMoves[i];
        console.log(currentState);
        if (currentState.action == "SHOOT") {
            numberOfArrors--;
            totalPoint -= 10;
            // make a shoot
            if (i + 1 == totalMoves) {
                console.log("totalPoint= ", totalPoint);
                break;
            }
        }

        if (currentState.move == "RIGHT") {
            nextPositionX++;
            totalPoint--;
            console.log("totalPoint= ", totalPoint);
        }
        else if (currentState.move == "LEFT") {
            nextPositionX--;
            totalPoint--;
            console.log("totalPoint= ", totalPoint);
        }
        else if (currentState.move == "UP") {
            nextPositionY--;
            totalPoint--;
            console.log("totalPoint= ", totalPoint);
        }
        else if (currentState.move == "DOWN") {
            nextPositionY++;
            totalPoint--;
            console.log("totalPoint= ", totalPoint);
        }

        // Make a move if move is not null
    }

    console.log(nextPositionY, nextPositionX)

    if (allMoves[totalMoves - 1].grab == true) {
        collectedGold++;
        totalPoint += 1000;
    }
    if (temp[2][temp[2].length - 1].action === "DIE") {
        totalPoint -= 1000;
        console.log("totalPoint= ", totalPoint);
        break;
    }
    if (collectedGold == maximumGold) {
        console.log("totalPoint= ", totalPoint);
        break;
    }
}

CaveBoard.printCave(cave)
console.log("total collected gold=", collectedGold)
console.log("number of Arrorws=", numberOfArrors)