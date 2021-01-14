const pieceMoveObj = { //add onto these as #2 strategy to catering for black
    white: {
        pawn: {
            direction: ["pawn_forward", "pawn_diagonal_forward_left", "pawn_diagonal_forward_right",],
            total: {
                primary: 1
            }
        },
        rook: {
            direction: ["forward", "backward", "left", "right"],
            total: {
                primary: 8,
            }
        },
        knight: {
            direction: ["knight_forward_left", "knight_backward_left", "knight_forward_right", "knight_backward_right", "knight_left_forward", "knight_left_backward", "knight_right_forward", "knight_right_backward"],
            total: {
                primary: 1,
            }
        },
        bishop: {
            direction: ["diagonal_forward_left", "diagonal_backward_left", "diagonal_forward_right", "diagonal_backward_right"],
            total: {
                primary: 8,
            }
        },
        queen: {
            direction: ["forward", "backward", "left", "right", "diagonal_forward_left", "diagonal_backward_left", "diagonal_forward_right", "diagonal_backward_right"],
            total: {
                primary: 8,
            },
        },
        king: {
            direction: ["forward", "backward", "left", "right", "diagonal_forward_left", "diagonal_backward_left", "diagonal_forward_right", "diagonal_backward_right"],
            total: {
                primary: 1,
            },
        },
    },
    black: {
        pawn: {
            direction: ["pawn_backward", "pawn_diagonal_backward_left", "pawn_diagonal_backward_right"],
            total: {
                primary: 1
            }
        },
        rook: {
            direction: ["backward", "forward", "right", "left"],
            total: {
                primary: 8,
            }
        },
        knight: {
            direction: ["knight_backward_right", "knight_forward_right", "knight_backward_left", "knight_forward_left", "knight_right_backward", "knight_right_forward", "knight_left_backward", "knight_left_forward"],
            total: {
                primary: 1,
            }
        },
        bishop: {
            direction: ["diagonal_backward_right", "diagonal_forward_right", "diagonal_backward_left", "diagonal_forward_left"],
            total: {
                primary: 8,
            }
        },
        queen: {
            direction: ["backward", "forward", "right", "left", "diagonal_backward_right", "diagonal_backward_left", "diagonal_forward_right", "diagonal_forward_left"],
            total: {
                primary: 8,
            },
        },
        king: {
            direction: ["backward", "forward", "right", "left", "diagonal_backward_right", "diagonal_backward_left", "diagonal_forward_right", "diagonal_forward_left"],
            total: {
                primary: 1,
            },
        },
    }
}

const directionConverterObj = {
    pawn_forward: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, value = 8) {
            const legalSecondarySquareIndexes = []; //console.log("this", this);
            parent: for (let currentTotal = 1; currentTotal <= total; currentTotal++) {
                const potentialSquare = originalSquareIndex + (value * currentTotal);
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                if (potentialSquare <= 63) {
                    legalSecondarySquareIndexes.push(potentialSquare);
                }
            }
            return legalSecondarySquareIndexes;
        },
    },
    pawn_backward: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, value = -8) {
            const legalSecondarySquareIndexes = [];
            parent: for (let currentTotal = 1; currentTotal <= total; currentTotal++) {
                const potentialSquare = originalSquareIndex + (value * currentTotal);
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                if (potentialSquare >= 0) {
                    legalSecondarySquareIndexes.push(potentialSquare);
                }
            }
            return legalSecondarySquareIndexes;
        },
    },
    pawn_diagonal_forward_left: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, valueUp = 8, valueLeft = -1) {
            total = total === 2 ? 1 : total; //stops unmoved pawns from diagonally killing up to 2 squares
            const legalSecondarySquareIndexes = [];

            //calculate squares it can hop before it reaches left-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueLeft; !(originalSquareIndex % 8 === 0); counter++, potentialSquare--) {
                if (potentialSquare % 8 === 0) {
                    counter++;
                    break;
                }
            }
            parent: for (let currentTotal = 1, potentialSquare = originalSquareIndex + (valueUp + valueLeft) * currentTotal, currentCounter = 1; (currentCounter <= counter) && (currentTotal <= total) && potentialSquare <= 63; currentTotal++, potentialSquare = potentialSquare + (valueUp + valueLeft) * currentTotal, currentCounter++) {
                //check if potentialSquare occupied by opponent piece
                if (!boardArraySquaresWithOpponentPiece.some((squareWithOpponentPiece) => squareWithOpponentPiece.index === potentialSquare)) {
                    break parent;
                }
                legalSecondarySquareIndexes.push(potentialSquare);
            }
            return legalSecondarySquareIndexes;
        }
    },
    pawn_diagonal_backward_left: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, valueDown = -8, valueLeft = -1) {
            total = total === 2 ? 1 : total; //stops unmoved pawns from diagonally killing up to 2 squares
            const legalSecondarySquareIndexes = [];

            //calculate squares it can hop before it reaches left-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueLeft; !(originalSquareIndex % 8 === 0); counter++, potentialSquare--) {
                if (potentialSquare % 8 === 0) {
                    counter++;
                    break;
                }
            }
            parent: for (let currentTotal = 1, potentialSquare = originalSquareIndex + (valueDown + valueLeft) * currentTotal, currentCounter = 1; (currentCounter <= counter) && (currentTotal <= total) && potentialSquare >= 0; currentTotal++, potentialSquare = potentialSquare + (valueDown + valueLeft) * currentTotal, currentCounter++) {
                //check if potentialSquare occupied by opponent piece
                if (!boardArraySquaresWithOpponentPiece.some((squareWithOpponentPiece) => squareWithOpponentPiece.index === potentialSquare)) {
                    break parent;
                }
                legalSecondarySquareIndexes.push(potentialSquare);
            }
            return legalSecondarySquareIndexes;
        }
    },
    pawn_diagonal_forward_right: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, valueUp = 8, valueRight = 1) {
            total = total === 2 ? 1 : total; //stops unmoved pawns from diagonally killing up to 2 squares
            const legalSecondarySquareIndexes = [];

            //calculate squares before it reaches right-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueRight; !((originalSquareIndex - 7) % 8 === 0); counter++, potentialSquare++) {
                if ((potentialSquare - 7) % 8 === 0) {
                    counter++;
                    break;
                }
            }

            parent: for (let currentTotal = 1, potentialSquare = originalSquareIndex + (valueUp + valueRight) * currentTotal, currentCounter = 1; (currentCounter <= counter) && (currentTotal <= total) && potentialSquare <= 63; currentTotal++, potentialSquare = potentialSquare + (valueUp + valueRight) * currentTotal, currentCounter++) {
                //check if potentialSquare occupied by opponent piece
                if (!boardArraySquaresWithOpponentPiece.some((squareWithOpponentPiece) => squareWithOpponentPiece.index === potentialSquare)) {
                    break parent;
                }
                legalSecondarySquareIndexes.push(potentialSquare);
            }
            return legalSecondarySquareIndexes;
        }
    },
    pawn_diagonal_backward_right: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, valueDown = -8, valueRight = 1) {
            total = total === 2 ? 1 : total; //stops unmoved pawns from diagonally killing up to 2 squares
            const legalSecondarySquareIndexes = [];

            //calculate squares before it reaches right-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueRight; !((originalSquareIndex - 7) % 8 === 0); counter++, potentialSquare++) {
                if ((potentialSquare - 7) % 8 === 0) {
                    counter++;
                    break;
                }
            }

            parent: for (let currentTotal = 1, potentialSquare = originalSquareIndex + (valueDown + valueRight) * currentTotal, currentCounter = 1; (currentCounter <= counter) && (currentTotal <= total) && potentialSquare >= 0; currentTotal++, potentialSquare = potentialSquare + (valueDown + valueRight) * currentTotal, currentCounter++) {
                //check if potentialSquare occupied by opponent piece
                if (!boardArraySquaresWithOpponentPiece.some((squareWithOpponentPiece) => squareWithOpponentPiece.index === potentialSquare)) {
                    break parent;
                }
                legalSecondarySquareIndexes.push(potentialSquare);
            }
            return legalSecondarySquareIndexes;
        }
    },
    forward: { //check to see not above 63
        value: 8,
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, value = 8) {
            const legalSecondarySquareIndexes = []; //console.log("total:", total, "originalSquareIndex:", originalSquareIndex, "boardArraySquaresWithUserPiece:", boardArraySquaresWithUserPiece, "boardArraySquaresWithOpponentPiece:", boardArraySquaresWithOpponentPiece);
            parent: for (let currentTotal = 1; currentTotal <= total; currentTotal++) {
                const potentialSquare = originalSquareIndex + (value * currentTotal); //console.log("potentialSquare", potentialSquare);

                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                //check if potentialSquare occupied by opponent piece
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                        break parent;
                    }
                }

                if (potentialSquare <= 63) {
                    legalSecondarySquareIndexes.push(potentialSquare);
                }
                // else { //in case of a knight hopping.
                //     break;
                // } 
            } //console.log(legalSecondarySquareIndexes);
            return legalSecondarySquareIndexes;
        },
    },
    backward: {//-8, //check to see not below 0.
        value: -8,
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, value = -8) {
            const legalSecondarySquareIndexes = [];
            parent: for (let currentTotal = 1; currentTotal <= total; currentTotal++) {
                const potentialSquare = originalSquareIndex + (value * currentTotal);
                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                //check if potentialSquare occupied by opponent piece
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                        break parent;
                    }
                }

                if (potentialSquare >= 0) {
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
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, value = -1) {
            const legalSecondarySquareIndexes = [];
            //calculate squares it can hop before it reaches left-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + value; !(originalSquareIndex % 8 === 0); counter++, potentialSquare--) {
                if (potentialSquare % 8 === 0) {
                    counter++;
                    break;
                }
            }
            // console.log("counter:", counter, "originalSquareIndex:", originalSquareIndex);
            parent: for (let potentialSquare = originalSquareIndex + value, currentCounter = 1, currentTotal = 1; (currentCounter <= counter) && (currentTotal <= total); potentialSquare--, currentCounter++, currentTotal++) {
                const potentialSquare = originalSquareIndex + (value * currentTotal);

                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                //check if potentialSquare occupied by opponent piece
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                        break parent;
                    }
                }

                legalSecondarySquareIndexes.push(potentialSquare);
            }
            return legalSecondarySquareIndexes;
        },
    },
    right: {//doesn't go above higher-closest multiple of 7 (starting on 8).
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, value = 1) {
            const legalSecondarySquareIndexes = [];
            //calculate squares before it reaches right-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + value; !((originalSquareIndex - 7) % 8 === 0); counter++, potentialSquare++) {
                if ((potentialSquare - 7) % 8 === 0) {
                    counter++;
                    break;
                }
            }
            parent: for (let potentialSquare = originalSquareIndex + value, currentCounter = 1, currentTotal = 1; (currentCounter <= counter) && (currentTotal <= total); potentialSquare--, currentCounter++, currentTotal++) {
                const potentialSquare = originalSquareIndex + (value * currentTotal);

                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                //check if potentialSquare occupied by opponent piece
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                        break parent;
                    }
                }

                legalSecondarySquareIndexes.push(potentialSquare);
            }
            return legalSecondarySquareIndexes;
        }
    },
    diagonal_forward_left: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, valueUp = 8, valueLeft = -1) {
            const legalSecondarySquareIndexes = [];

            //calculate squares it can hop before it reaches left-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueLeft; !(originalSquareIndex % 8 === 0); counter++, potentialSquare--) {
                if (potentialSquare % 8 === 0) {
                    counter++;
                    break;
                }
            }

            parent: for (let potentialSquare = originalSquareIndex + valueUp + valueLeft, currentCounter = 1, currentTotal = 1; (currentCounter <= counter) && (currentTotal <= total) && potentialSquare <= 63; potentialSquare = potentialSquare + valueUp + valueLeft, currentCounter++, currentTotal++) {
                const potentialSquare = originalSquareIndex + ((valueUp + valueLeft) * currentTotal);

                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                //check if potentialSquare occupied by opponent piece
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                        break parent;
                    }
                }

                legalSecondarySquareIndexes.push(potentialSquare);

            }
            return legalSecondarySquareIndexes;
        }
    },
    diagonal_backward_left: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, valueDown = -8, valueLeft = -1) {
            const legalSecondarySquareIndexes = [];

            //calculate squares it can hop before it reaches left-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueLeft; !(originalSquareIndex % 8 === 0); counter++, potentialSquare--) {
                if (potentialSquare % 8 === 0) {
                    counter++;
                    break;
                }
            }

            parent: for (let potentialSquare = originalSquareIndex + valueDown + valueLeft, currentCounter = 1, currentTotal = 1; (currentCounter <= counter) && (currentTotal <= total) && potentialSquare >= 0; potentialSquare = potentialSquare + valueDown + valueLeft, currentCounter++, currentTotal++) {
                const potentialSquare = originalSquareIndex + ((valueDown + valueLeft) * currentTotal);

                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                //check if potentialSquare occupied by opponent piece
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                        break parent;
                    }
                }

                legalSecondarySquareIndexes.push(potentialSquare);

            }
            return legalSecondarySquareIndexes;
        }
    },
    diagonal_forward_right: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, valueUp = 8, valueRight = 1) {
            const legalSecondarySquareIndexes = [];

            //calculate squares before it reaches right-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueRight; !((originalSquareIndex - 7) % 8 === 0); counter++, potentialSquare++) {
                if ((potentialSquare - 7) % 8 === 0) {
                    counter++;
                    break;
                }
            }

            parent: for (let potentialSquare = originalSquareIndex + valueUp + valueRight, currentCounter = 1, currentTotal = 1; (currentCounter <= counter) && (currentTotal <= total) && potentialSquare <= 63; potentialSquare = potentialSquare + valueUp + valueRight, currentCounter++, currentTotal++) {
                const potentialSquare = originalSquareIndex + ((valueUp + valueRight) * currentTotal);

                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                //check if potentialSquare occupied by opponent piece
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                        break parent;
                    }
                }

                legalSecondarySquareIndexes.push(potentialSquare);

            }
            return legalSecondarySquareIndexes;
        }
    },
    diagonal_backward_right: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, valueDown = -8, valueRight = 1) {
            const legalSecondarySquareIndexes = [];

            //calculate squares before it reaches right-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueRight; !((originalSquareIndex - 7) % 8 === 0); counter++, potentialSquare++) {
                if ((potentialSquare - 7) % 8 === 0) {
                    counter++;
                    break;
                }
            }

            parent: for (let potentialSquare = originalSquareIndex + valueDown + valueRight, currentCounter = 1, currentTotal = 1; (currentCounter <= counter) && (currentTotal <= total) && potentialSquare >= 0; potentialSquare = potentialSquare + valueDown + valueRight, currentCounter++, currentTotal++) {
                const potentialSquare = originalSquareIndex + ((valueDown + valueRight) * currentTotal);

                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                //check if potentialSquare occupied by opponent piece
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                        break parent;
                    }
                }

                legalSecondarySquareIndexes.push(potentialSquare);

            }
            return legalSecondarySquareIndexes;
        }
    },
    knight_forward_left: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, valueUp = 16, valueLeft = -1) {
            const legalSecondarySquareIndexes = [];

            //calculate squares it can hop before it reaches left-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueLeft; !(originalSquareIndex % 8 === 0); counter++, potentialSquare--) {
                if (potentialSquare % 8 === 0) {
                    counter++;
                    break;
                }
            }

            parent: for (let potentialSquare = originalSquareIndex + valueUp + valueLeft, currentCounter = 1, currentTotal = 1; (currentCounter <= counter) && (currentTotal <= total) && potentialSquare <= 63; potentialSquare = potentialSquare + valueUp + valueLeft, currentCounter++, currentTotal++) {
                const potentialSquare = originalSquareIndex + ((valueUp + valueLeft) * currentTotal);

                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                //check if potentialSquare occupied by opponent piece
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                        break parent;
                    }
                }

                legalSecondarySquareIndexes.push(potentialSquare);

            }
            return legalSecondarySquareIndexes;
        }
    },
    knight_backward_left: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, valueDown = -16, valueLeft = -1) {
            const legalSecondarySquareIndexes = [];

            //calculate squares it can hop before it reaches left-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueLeft; !(originalSquareIndex % 8 === 0); counter++, potentialSquare--) {
                if (potentialSquare % 8 === 0) {
                    counter++;
                    break;
                }
            }

            parent: for (let potentialSquare = originalSquareIndex + valueDown + valueLeft, currentCounter = 1, currentTotal = 1; (currentCounter <= counter) && (currentTotal <= total) && potentialSquare >= 0; potentialSquare = potentialSquare + valueDown + valueLeft, currentCounter++, currentTotal++) {
                const potentialSquare = originalSquareIndex + ((valueDown + valueLeft) * currentTotal);

                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                //check if potentialSquare occupied by opponent piece
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                        break parent;
                    }
                }

                legalSecondarySquareIndexes.push(potentialSquare);

            }
            return legalSecondarySquareIndexes;
        }
    },
    knight_forward_right: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, valueUp = 16, valueRight = 1) {
            const legalSecondarySquareIndexes = [];

            //calculate squares before it reaches right-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueRight; !((originalSquareIndex - 7) % 8 === 0); counter++, potentialSquare++) {
                if ((potentialSquare - 7) % 8 === 0) {
                    counter++;
                    break;
                }
            }

            parent: for (let potentialSquare = originalSquareIndex + valueUp + valueRight, currentCounter = 1, currentTotal = 1; (currentCounter <= counter) && (currentTotal <= total) && potentialSquare <= 63; potentialSquare = potentialSquare + valueUp + valueRight, currentCounter++, currentTotal++) {
                const potentialSquare = originalSquareIndex + ((valueUp + valueRight) * currentTotal);

                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                //check if potentialSquare occupied by opponent piece
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                        break parent;
                    }
                }

                legalSecondarySquareIndexes.push(potentialSquare);

            }
            return legalSecondarySquareIndexes;
        }
    },
    knight_backward_right: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, valueDown = -16, valueRight = 1) {
            const legalSecondarySquareIndexes = [];

            //calculate squares before it reaches right-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueRight; !((originalSquareIndex - 7) % 8 === 0); counter++, potentialSquare++) {
                if ((potentialSquare - 7) % 8 === 0) {
                    counter++;
                    break;
                }
            }

            parent: for (let potentialSquare = originalSquareIndex + valueDown + valueRight, currentCounter = 1, currentTotal = 1; (currentCounter <= counter) && (currentTotal <= total) && potentialSquare >= 0; potentialSquare = potentialSquare + valueDown + valueRight, currentCounter++, currentTotal++) {
                const potentialSquare = originalSquareIndex + ((valueDown + valueRight) * currentTotal);

                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                //check if potentialSquare occupied by opponent piece
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                        break parent;
                    }
                }

                legalSecondarySquareIndexes.push(potentialSquare);

            }
            return legalSecondarySquareIndexes;
        }
    },
    knight_left_forward: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, valueUp = 8, valueLeft = -2) {
            const legalSecondarySquareIndexes = [];

            //calculate squares it can hop before it reaches left-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueLeft; !(originalSquareIndex % 8 === 0) && !((originalSquareIndex - 1) % 8 === 0); counter++, potentialSquare--) {
                if (potentialSquare % 8 === 0 || (potentialSquare - 1) % 8 === 0) {
                    counter++;
                    break;
                }
            }

            parent: for (let potentialSquare = originalSquareIndex + valueUp + valueLeft, currentCounter = 1, currentTotal = 1; (currentCounter <= counter) && (currentTotal <= total) && potentialSquare <= 63; potentialSquare = potentialSquare + valueUp + valueLeft, currentCounter++, currentTotal++) {
                const potentialSquare = originalSquareIndex + ((valueUp + valueLeft) * currentTotal);

                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                //check if potentialSquare occupied by opponent piece
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                        break parent;
                    }
                }

                legalSecondarySquareIndexes.push(potentialSquare);

            }
            return legalSecondarySquareIndexes;
        }
    },
    knight_left_backward: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, valueDown = -8, valueLeft = -2) {
            const legalSecondarySquareIndexes = [];

            //calculate squares it can hop before it reaches left-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueLeft; !(originalSquareIndex % 8 === 0) && !((originalSquareIndex - 1) % 8 === 0); counter++, potentialSquare--) {
                if (potentialSquare % 8 === 0 || (potentialSquare - 1) % 8 === 0) {
                    counter++;
                    break;
                }
            }

            console.log(counter);

            parent: for (let potentialSquare = originalSquareIndex + valueDown + valueLeft, currentCounter = 1, currentTotal = 1; (currentCounter <= counter) && (currentTotal <= total) && potentialSquare >= 0; potentialSquare = potentialSquare + valueDown + valueLeft, currentCounter++, currentTotal++) {
                const potentialSquare = originalSquareIndex + ((valueDown + valueLeft) * currentTotal);

                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                //check if potentialSquare occupied by opponent piece
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                        break parent;
                    }
                }

                legalSecondarySquareIndexes.push(potentialSquare);

            }
            return legalSecondarySquareIndexes;
        }

    },
    knight_right_forward: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, valueUp = 8, valueRight = 2) {
            const legalSecondarySquareIndexes = [];

            //calculate squares before it reaches right-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueRight; !((originalSquareIndex - 7) % 8 === 0) && !((originalSquareIndex - 6) % 8 === 0); counter++, potentialSquare++) {
                if ((potentialSquare - 7) % 8 === 0 || (potentialSquare - 6) % 8 === 0) {
                    counter++;
                    break;
                }
            }

            parent: for (let potentialSquare = originalSquareIndex + valueUp + valueRight, currentCounter = 1, currentTotal = 1; (currentCounter <= counter) && (currentTotal <= total) && potentialSquare <= 63; potentialSquare = potentialSquare + valueUp + valueRight, currentCounter++, currentTotal++) {
                const potentialSquare = originalSquareIndex + ((valueUp + valueRight) * currentTotal);

                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                //check if potentialSquare occupied by opponent piece
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                        break parent;
                    }
                }

                legalSecondarySquareIndexes.push(potentialSquare);

            }
            return legalSecondarySquareIndexes;
        }
    },
    knight_right_backward: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, valueDown = -8, valueRight = 2) {
            const legalSecondarySquareIndexes = [];

            //calculate squares before it reaches right-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueRight; !((originalSquareIndex - 7) % 8 === 0) && !((originalSquareIndex - 6) % 8 === 0); counter++, potentialSquare++) {
                if ((potentialSquare - 7) % 8 === 0 || (potentialSquare - 6) % 8 === 0) {
                    counter++;
                    break;
                }
            }

            parent: for (let potentialSquare = originalSquareIndex + valueDown + valueRight, currentCounter = 1, currentTotal = 1; (currentCounter <= counter) && (currentTotal <= total) && potentialSquare >= 0; potentialSquare = potentialSquare + valueDown + valueRight, currentCounter++, currentTotal++) {
                const potentialSquare = originalSquareIndex + ((valueDown + valueRight) * currentTotal);

                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        break parent;
                    }
                }
                //check if potentialSquare occupied by opponent piece
                for (const squareWithOpponentPiece of boardArraySquaresWithOpponentPiece) {
                    if (squareWithOpponentPiece.index === potentialSquare) {
                        legalSecondarySquareIndexes.push(potentialSquare);
                        break parent;
                    }
                }

                legalSecondarySquareIndexes.push(potentialSquare);

            }
            return legalSecondarySquareIndexes;
        }
    }
};

function returnPieceEmoji(name) {//console.log(name);
    name = name.replace(/\d/, '');
    switch (name) {
        case "pawn":
            return "⌂";
        case "rook":
            return "♜"
        case "knight":
            return "♞"
        case "bishop":
            return "♝"
        case "queen":
            return "♛"
        case "king":
            return "♚"
        default:
            console.log("no match found!");
    }
}

//doesn't work: ♟(empty pawn)♟(black pawn)
//can-be-colored-in:⚚✝︎⏃⌵⌂


export { pieceMoveObj, directionConverterObj, returnPieceEmoji };