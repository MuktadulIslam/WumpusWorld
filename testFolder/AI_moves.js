const constants = require('./constants.js');
const CaveBoard = require('./cave.js');
const Path = require('./path.js');
const ProbabilisticMove = require('./probabilisticMove.js');
const KnowledgeBase = require('./knowledgeBase.js');

function AI_move_By_Propositional_logic(knowledgeBase, cave, numberOfArrors, currentPositionY, currentPositionX) {
    // const knowledgeBase
    // CaveBoard.printCave(cave);
    // console.log(knowledgeBase)
    const move = ProbabilisticMove.makeProbabilisticMove(knowledgeBase, cave, numberOfArrors, currentPositionY,currentPositionX);
    knowledgeBase = KnowledgeBase.update(cave, knowledgeBase, move.positionY, move.positionX);
    console.log(move)   
}

// AI_move_By_Propositional_logic(CaveBoard.randomCaveGeneration(4, 8, 7))
// AI_move_By_Propositional_logic(CaveBoard.initialize())
// CaveBoard.printCave(cave)
// printCave();
// CaveBoard.printCave(CaveBoard.initialize());
// console.log(CaveBoard.numberOfGolds(CaveBoard.initialize()))

module.exports = {
    AI_move_By_Propositional_logic
}