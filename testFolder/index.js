const constants = require('./constants.js');
const CaveBoard = require('./cave.js');
const Path = require('./path.js');
const ProbabilisticMove = require('./probabilisticMove.js');
const Move = require('./AI_moves.js')
const KnowledgeBase = require('./knowledgeBase.js')


// let cave = CaveBoard.randomCaveGeneration(4, 8, 7)
let cave = CaveBoard.initialize()
let knowledgeBase = KnowledgeBase.initializeKnowledgeBase(cave)
let numberOfArrors = CaveBoard.getTotalNumberOfWumpus(cave)

knowledgeBase = KnowledgeBase.update(cave, knowledgeBase, 0, 0);
console.log(knowledgeBase)
// let nextAction = { action: 'NO_ACTION', riskOfWumpus: 0, riskOfPit: 0, positionY: 0, positionX: 0 };
// while (true) {
//     let temp = Move.AI_move_By_Propositional_logic(knowledgeBase, cave, numberOfArrors, nextAction.positionY, nextAction.positionX);
//     if (temp === null) break;
//     break;

//     knowledgeBase = temp[0];
//     cave = temp[1];
//     nextAction = temp[2];
//     console.log(nextAction);
// }