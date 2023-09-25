async function moveToNextPostion(cY, cX, nY, nX) {
    if (cY == nY && cX == nX) return true;

    let possibleMoves = [];
    // Finding the best moves by compairing the distence
    if (cX > 0 && knowledgeBase[cY][cX - 1].safe) possibleMoves.push([cY, cX - 1, distenceOfTwoRooms(cY, cX - 1, nY, nX)])
    if (cX + 1 < constants.CAVE_WIDTH && knowledgeBase[cY][cX + 1].safe) possibleMoves.push([cY, cX + 1, distenceOfTwoRooms(cY, cX + 1, nY, nX)])
    if (cY > 0 && knowledgeBase[cY - 1][cX].safe) possibleMoves.push([cY - 1, cX, distenceOfTwoRooms(cY - 1, cX, nY, nX)])
    if (cY + 1 < constants.CAVE_LENGTH && knowledgeBase[cY + 1][cX].safe) possibleMoves.push([cY + 1, cX, distenceOfTwoRooms(cY + 1, cX, nY, nX)])

    if(possibleMoves.length == 0){
        return false;
    }

    let i, j;
    let l = possibleMoves.length;
    // sorting the possible moves according to minimum distence
    for (i = 0; i < l; i++) {
        for (j = i + 1; j < l; j++) {
            if (possibleMoves[j][2] < possibleMoves[i][2]) {
                let temp = possibleMoves[j];
                possibleMoves[j] = possibleMoves[i];
                possibleMoves[i] = temp;
            }
        }
    }

    // make this loop while agent can't go to the destination by using any the rooms
    for (i = 0; i < l; i++) {
        let action = null, grab = null, move = null;
        let bestNextMoveY = possibleMoves[i][0], bestNextMoveX = possibleMoves[i][1];

        if (cave[bestNextMoveY][bestNextMoveX].includes(constants.DEAD_WUMPUS)) action = 'SHOOT';
        else if (cave[bestNextMoveY][bestNextMoveX].includes(constants.WUMPUS) || cave[bestNextMoveY][bestNextMoveX].includes(constants.PIT)) {
            action = 'DIE';
            isKilled = true;
        }
        else action = "NO_ACTION";

        if (cave[cY][cX].includes(constants.GOLD)) {
            grab = true;
            totalNumberOfGold--;
            cave[cY][cX].filter(item => item !== constants.GOLD);
        }
        else grab = false;

        // console.log(cY,cX,"   ", bestNextMoveY, bestNextMoveX, "   ", nY, nX, action, cave[bestNextMoveY][bestNextMoveX]);
        // await sleep(500)

        if (bestNextMoveY < cY) move = "UP"
        else if (bestNextMoveY > cY) move = "DOWN";
        else if (bestNextMoveX < cX) move = "LEFT";
        else if (bestNextMoveX > cX) move = "RIGHT";

        moveList.push({ move: move, action: action, grab: grab })

        if(isKilled || totalNumberOfGold <= 0) return true;
        else {
            let temp = moveToNextPostion(bestNextMoveY, bestNextMoveX, nY, nX)
            if(temp == true) {
                return true;
            }
        }
    }
    return false;
}