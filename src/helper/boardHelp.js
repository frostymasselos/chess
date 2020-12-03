const pieceMoveObj = {
    pawn: {
        direction: ["forward"],
        total: {
            primary: 2,
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
        direction: ["foward-left", "forward-right", "left-backward", "left-forward", "backward-left", "backward-right", "right-forward", "right-backward"],
        total: {
            primary: 2,
            secondary: 1,
        }
    },
    bishop: {
        direction: ["diagonal-forward-left", "diagonal-forward-right", "diagonal-backward-left", "diagonal-backward-right"],
        total: {
            primary: 8,
            secondary: 8,//must match primary
        }
    },
    queen: {
        direction: ["forward", "backward", "left", "right", "diagonal-forward-left", "diagonal-forward-right", "diagonal-backward-left", "diagonal-backward-right"],
        total: {
            primary: 8,
            secondary: 8,//must match primary
        },
    },
    king: {
        direction: ["forward", "backward", "left", "right", "diagonal-forward-left", "diagonal-forward-right", "diagonal-backward-left", "diagonal-backward-right"],
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
                    if (potentialSquare <= 63) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                    }
                }
                return legalSecondarySquareIndexes;
            },
        }, 
        backward: {//-8, //check to see not below 0.
            value: -8,
            funcPrimary(total, originalSquareIndex, value = 8) {
                const legalSecondarySquareIndexes = [];
                for (let currentTotal = 1; currentTotal <= total; currentTotal++) {
                    const potentialSquare = originalSquareIndex + (value * currentTotal);
                    if (potentialSquare <= 63) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                    }
                }
                return legalSecondarySquareIndexes;
            }
        },
        left: -1, //check to see not below 0, can't be multiple of 8. 
        right: 1, //check to see not above 63, can't be multiple of 7 (starting on 8).
    },
    black: {
        forward: -8,
        backward: 8,
        left: 1, //check to see not above 63, can't be multiple of 7.
        right: -1 //check to see not below 0, can't be multiple of 8. 
    },
};

export {pieceMoveObj, directionConverterObj};