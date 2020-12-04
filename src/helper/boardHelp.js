const pieceMoveObj = {
    pawn: {
        direction: ["diagonal_forward_left"],
        total: {
            primary: 8,
            secondary: null
        }
    },
    rook: {
        direction: ["forward", "backward", "left", "right"],
        total: {
            primary: 8,
            secondary: null,
        }
    },
    knight: {
        direction: ["foward_left", "forward_right", "left_backward", "left_forward", "backward_left", "backward_right", "right_forward", "right_backward"],
        total: {
            primary: 2,
            secondary: 1,
        }
    },
    bishop: {
        direction: ["diagonal_forward_left", "diagonal_forward_right", "diagonal_backward_left", "diagonal_backward_right"],
        total: {
            primary: 8,
            secondary: 8,//must match primary
        }
    },
    queen: {
        direction: ["forward", "backward", "left", "right", "diagonal_forward_left", "diagonal_forward_right", "diagonal_backward_left", "diagonal_backward_right"],
        total: {
            primary: 8,
            secondary: 8,//must match primary
        },
    },
    king: {
        direction: ["forward", "backward", "left", "right", "diagonal_forward_left", "diagonal_forward_right", "diagonal_backward_left", "diagonal_backward_right"],
        total: {
            primary: 1,
            secondary: 1,
        },
    },
}

const directionConverterObj = {
    white: {
        forward: { //check to see not above 63
            value: 8,
            funcPrimary(total, originalSquareIndex, value = 8) {
                const legalSecondarySquareIndexes = [];
                for (let currentTotal = 1; currentTotal <= total; currentTotal++) {
                    const potentialSquare = originalSquareIndex + (value * currentTotal);
                    if (potentialSquare >= 0 && potentialSquare <= 63) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                    } 
                    // else { //in case of a knight hopping.
                    //     break;
                    // } 
                }
                return legalSecondarySquareIndexes;
            },
        }, 
        backward: {//-8, //check to see not below 0.
            value: -8,
            funcPrimary(total, originalSquareIndex, value = -8) {
                const legalSecondarySquareIndexes = [];
                for (let currentTotal = 1; currentTotal <= total; currentTotal++) {
                    const potentialSquare = originalSquareIndex + (value * currentTotal);
                    if (potentialSquare >= 0 && potentialSquare <= 63) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                    } 
                    // else { //in case of a knight hopping.
                    //     break;
                    // } 
                }
                return legalSecondarySquareIndexes;
            }
        },
        left: { //check to see not below 0 & doesn't go below lower-closest multiple of 8.
            value: -1,
            funcPrimary(total, originalSquareIndex, value = -1) {
                const legalSecondarySquareIndexes = [];
                //calculate
                let counter = 0;
                for (let potentialSquare = originalSquareIndex + value; !(originalSquareIndex % 8 === 0); counter++, potentialSquare--) {
                    if (potentialSquare % 8 === 0) {
                        counter++;
                        break;
                    }
                }
                console.log("counter:", counter, "originalSquareIndex:", originalSquareIndex);
                for (let potentialSquare = originalSquareIndex + value, currentCounter = 1, currentTotal = 1; (currentCounter <= counter) && (currentTotal <= total); potentialSquare--, currentCounter++, currentTotal++) {
                    const potentialSquare = originalSquareIndex + (value * currentTotal);
                    legalSecondarySquareIndexes.push(potentialSquare);
                }
                return legalSecondarySquareIndexes;
            },
        }, 
        right: {//doesn't go above higher-closest multiple of 7 (starting on 8).
            funcPrimary(total, originalSquareIndex, value = 1) {
                const legalSecondarySquareIndexes = [];
                //calculate
                let counter = 0;
                for (let potentialSquare = originalSquareIndex + value; !((originalSquareIndex - 7) % 8 === 0); counter++, potentialSquare++) {
                    if ((potentialSquare - 7) % 8 === 0) {
                        counter++;
                        break;
                    }
                }
                console.log("counter:", counter, "originalSquareIndex:", originalSquareIndex);
                for (let potentialSquare = originalSquareIndex + value, currentCounter = 1, currentTotal = 1; (currentCounter <= counter) && (currentTotal <= total); potentialSquare--, currentCounter++, currentTotal++) {
                    const potentialSquare = originalSquareIndex + (value * currentTotal);
                    legalSecondarySquareIndexes.push(potentialSquare);
                }
                return legalSecondarySquareIndexes;
            }
        },
        diagonal_forward_left: {
            funcPrimary(total, originalSquareIndex) {
                const legalSecondarySquareIndexes = [];
                for (let num = 0; num < total; num++) {

                    
                }
                directionConverterObj.white.forward.funcPrimary(1, originalSquareIndex);
                directionConverterObj.white.left.funcPrimary(1, originalSquareIndex);
                return legalSecondarySquareIndexes;
            }
        }

    },
    black: { //reversing array for black would solve problem
        forward: -8,
        backward: 8,
        left: 1, //check to see not above 63, can't be multiple of 7.
        right: -1 //check to see not below 0, can't be multiple of 8. 
    },
};

export {pieceMoveObj, directionConverterObj};