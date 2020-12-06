const pieceMoveObj = { //add onto these as #2 strategy to catering for black
    white: {
        pawn: {
            direction: ["forward"],
            total: {
                primary: 8 
            }
        },
        rook: {
            direction: ["forward", "backward", "left", "right"],
            total: {
                primary: 8,
            }
        },
        knight: {
            direction: ["knight_forward_left", "knight_backward_left", "knight_forward_right", "knight_backward_right"],
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
            direction: ["backward"],
            total: {
                primary: 8 
            }
        },
        rook: {
            direction: ["backward", "forward", "right", "left"],
            total: {
                primary: 8,
            }
        },
        knight: {
            direction: ["knight_backward_right", "knight_forward_right", "knight_backward_left", "knight_forward_left"],
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
    forward: { //check to see not above 63
        value: 8,
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, value = 8) {
            const legalSecondarySquareIndexes = []; console.log(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece);
            parent: for (let currentTotal = 1; currentTotal <= total; currentTotal++) {
                const potentialSquare = originalSquareIndex + (value * currentTotal);

                //check if potentialSquare occupied by user piece
                for (const squareWithUserPiece of boardArraySquaresWithUserPiece) {
                    if (squareWithUserPiece.index === potentialSquare) {
                        return;
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
            } console.log(legalSecondarySquareIndexes);
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
            console.log("counter:", counter, "originalSquareIndex:", originalSquareIndex);
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
};

export {pieceMoveObj, directionConverterObj};