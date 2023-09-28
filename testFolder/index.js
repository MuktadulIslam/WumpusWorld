const constants = require('./constants.js');
const CaveBoard = require('./cave.js');
const Path = require('./path.js');
const ProbabilisticMove = require('./probabilisticMove.js');
const Move = require('./AI_moves.js')
const KnowledgeBase = require('./knowledgeBase.js')

function printKnowledgebase() {
    for (let i = 0; i < 10; i++) {
        let line = '';
        for (let j = 0; j < 10; j++) {
            let element = ''
            if (knowledgeBase[i][j].wumpusProbability == null) element = element + "w=N";
            else element = element + "w=" + String(knowledgeBase[i][j].wumpusProbability);

            if (knowledgeBase[i][j].pitProbability == null) element = element + " p=N";
            else element = element + " p=" + String(knowledgeBase[i][j].pitProbability);

            if (knowledgeBase[i][j].visited == true) element = element + " v=T";
            else element = element + " v=F";

            line = line + element.padEnd(15, " ");
        }
        console.log(line);
    }
    console.log();
}


// let cave = CaveBoard.randomCaveGeneration(4, 8, 7)
let cave = CaveBoard.initialize()
// CaveBoard.printCave(cave)
let knowledgeBase = KnowledgeBase.initializeKnowledgeBase(cave)
let numberOfArrors = CaveBoard.getTotalNumberOfWumpus(cave)

knowledgeBase = KnowledgeBase.update(cave, knowledgeBase, 0, 0);
// console.log(knowledgeBase)
let nextPositionY = 0;
let nextPositionX = 0;
while (true) {
    let temp = Move.AI_move_By_Propositional_logic(knowledgeBase, cave, numberOfArrors, nextPositionY, nextPositionX);

    //Updating knowledgebase & cave
    knowledgeBase = temp[0];
    cave = temp[1];

    // console.log(temp[2])
    temp[2].forEach(currentState => {
        console.log(nextPositionY,nextPositionX)
        console.log(currentState);
        if (currentState.move == "RIGHT") nextPositionX++;
        else if (currentState.move == "LEFT") nextPositionX--;
        else if (currentState.move == "UP") nextPositionY--;
        else if (currentState.move == "DOWN") nextPositionY++;
    });
    printKnowledgebase(knowledgeBase);
    CaveBoard.printCave(cave)
    if (temp[2][temp[2].length-1].action === "DIE") break;
    // console.log(nextAction);
    // break;
}