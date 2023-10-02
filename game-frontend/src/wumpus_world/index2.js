const constants = require('./constants.js');
const CaveBoard = require('./cave.js');
const Path = require('./path.js');
const ProbabilisticMove = require('./probabilisticMove.js');
const Move = require('./AI_moves.js')
const KnowledgeBase = require('./knowledgeBase.js')

function printKnowledgebase(knowledgeBase) {
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

async function performIteration() {

    let cave = CaveBoard.randomCaveGeneration(10,10, 4, 8, 7)
    // let cave = CaveBoard.initialize()
    // CaveBoard.printCave(cave)
    let knowledgeBase = KnowledgeBase.initializeKnowledgeBase(cave)
    let numberOfArrors = CaveBoard.getTotalNumberOfWumpus(cave)

    knowledgeBase = KnowledgeBase.update(cave, knowledgeBase, 0, 0);
    // console.log(knowledgeBase)
    let nextPositionY = 0;
    let nextPositionX = 0;
    let x = 0;
    while (true) {
        // console.log(x++)
        // if(x++ > 55) break;
        let temp = Move.AI_move_By_Propositional_logic(knowledgeBase, cave, numberOfArrors, nextPositionY, nextPositionX);

        //Updating knowledgebase & cave
        knowledgeBase = temp[0];
        cave = temp[1];

        // console.log(temp[2])
        temp[2].forEach(currentState => {
            console.log(currentState);
            if (currentState.move == "RIGHT") nextPositionX++;
            else if (currentState.move == "LEFT") nextPositionX--;
            else if (currentState.move == "UP") nextPositionY--;
            else if (currentState.move == "DOWN") nextPositionY++;
        });
        console.log(nextPositionY, nextPositionX)
        printKnowledgebase(knowledgeBase);
        CaveBoard.printCave(cave);
        if(temp[2][temp[2].length-1].grab == true) x++;
        if(temp[2][temp[2].length-2].action == "SHOOT") numberOfArrors--;
        if (temp[2][temp[2].length - 1].action === "DIE" || x == 4) break;

        // await new Promise(resolve => setTimeout(resolve, 5000));

        // console.log("\n\n\n");
        // break;
    }
    console.log("total collected gold=",x)
    console.log("number of Arrorws=",numberOfArrors)
}

performIteration();