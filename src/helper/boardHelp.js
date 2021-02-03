import fatKing from '../asset/images/chess_pieces/fat/king.svg';
import fatQueen from '../asset/images/chess_pieces/fat/queen.svg';
import fatRook from '../asset/images/chess_pieces/fat/rook.svg';
import fatKnight from '../asset/images/chess_pieces/fat/knight.svg';
import fatBishop from '../asset/images/chess_pieces/fat/bishop.svg';
import fatPawn from '../asset/images/chess_pieces/fat/pawn.svg';
import sparseKing from '../asset/images/chess_pieces/sparse/king.svg';
import sparseQueen from '../asset/images/chess_pieces/sparse/queen.svg';
import sparseRook from '../asset/images/chess_pieces/sparse/rook.svg';
import sparseKnight from '../asset/images/chess_pieces/sparse/knight.svg';
import sparseBishop from '../asset/images/chess_pieces/sparse/bishop.svg';
import sparsePawn from '../asset/images/chess_pieces/sparse/pawn.svg';

const pieceMoveObj = {
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
            direction: ["forward", "backward", "left", "right", "diagonal_forward_left", "diagonal_backward_left", "diagonal_forward_right", "diagonal_backward_right", "castling_left", "castling_right"],
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
            direction: ["diagonal_forward_left", "diagonal_backward_left", "diagonal_forward_right", "diagonal_backward_right"],
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
            direction: ["backward", "forward", "right", "left", "diagonal_backward_right", "diagonal_backward_left", "diagonal_forward_right", "diagonal_forward_left", "castling_left", "castling_right"],
            total: {
                primary: 1,
            },
        },
    }
}

//abstract
function enpassant(boardArraySquaresWithOpponentPiece, originalSquareIndex, adjacentIndex) {
    return boardArraySquaresWithOpponentPiece.some((squareWithOpponentPiece) => squareWithOpponentPiece.piece.name.includes("pawn") && squareWithOpponentPiece.piece.justMoved2Squares && squareWithOpponentPiece.index === originalSquareIndex + adjacentIndex);
}
function areSquaresEmpty(squaresToCheck, boardArray) {
    return squaresToCheck.every((square) => {
        return !boardArray[square].piece
    });
}
function kingMovingToTheseSquaresDoesntPutHimInCheck(squareIndicesArray, kingIndex, boardArray, cleverFunction) {
    return squareIndicesArray.every((squareIndex) => {
        const board2 = JSON.parse(JSON.stringify(boardArray));//console.log(board2, squareIndex);
        const king = JSON.parse(JSON.stringify(board2[kingIndex].piece));//have to do this because we're changing original location to `null`?
        board2[squareIndex].piece = king;
        board2[kingIndex].piece = null;//console.log(board2);
        return !cleverFunction(board2);
    });
}

const directionConverterObj = {
    pawn_forward: {
        value: 8,
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const value = 8;
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
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const value = -8;
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
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const [valueUp, valueLeft] = [8, -1];
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
                if (!(boardArraySquaresWithOpponentPiece.some((squareWithOpponentPiece) => squareWithOpponentPiece.index === potentialSquare) || enpassant(boardArraySquaresWithOpponentPiece, originalSquareIndex, valueLeft))) {
                    break parent;
                }
                legalSecondarySquareIndexes.push(potentialSquare);
            }
            return legalSecondarySquareIndexes;
        }
    },
    pawn_diagonal_backward_left: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const [valueDown, valueLeft] = [-8, -1];
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
                if (!(boardArraySquaresWithOpponentPiece.some((squareWithOpponentPiece) => squareWithOpponentPiece.index === potentialSquare) || enpassant(boardArraySquaresWithOpponentPiece, originalSquareIndex, valueLeft))) {
                    break parent;
                }
                legalSecondarySquareIndexes.push(potentialSquare);
            }
            return legalSecondarySquareIndexes;
        }
    },
    pawn_diagonal_forward_right: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const [valueUp, valueRight] = [8, 1];
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
                if (!(boardArraySquaresWithOpponentPiece.some((squareWithOpponentPiece) => squareWithOpponentPiece.index === potentialSquare) || enpassant(boardArraySquaresWithOpponentPiece, originalSquareIndex, valueRight))) {
                    break parent;
                }
                legalSecondarySquareIndexes.push(potentialSquare);
            }
            return legalSecondarySquareIndexes;
        }
    },
    pawn_diagonal_backward_right: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const [valueDown, valueRight] = [-8, 1];
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
                if (!(boardArraySquaresWithOpponentPiece.some((squareWithOpponentPiece) => squareWithOpponentPiece.index === potentialSquare) || enpassant(boardArraySquaresWithOpponentPiece, originalSquareIndex, valueRight))) {
                    break parent;
                }
                legalSecondarySquareIndexes.push(potentialSquare);
            }
            return legalSecondarySquareIndexes;
        }
    },
    forward: {
        value: 8,
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const value = 8;
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
            } //console.log(legalSecondarySquareIndexes);
            return legalSecondarySquareIndexes;
        },
    },
    backward: {
        value: -8,
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const value = -8;
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
            }
            return legalSecondarySquareIndexes;
        }
    },
    left: { //check to see not below 0 & doesn't go below lower-closest multiple of 8.
        value: -1,
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const value = -1;
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
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const value = 1;
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
    castling_left: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, { check, isUserKingInCheck, boardArray, ourColor, }) {
            const legalSecondarySquareIndexes = [];//console.log(check, isUserKingInCheck, boardArray, ourColor);
            if (!check) {
                if (ourColor === "white") {
                    //white. if ...`
                    //i) make sure rook's alive ii) both on the right spot...copy this for black.
                    const userKingSquare = boardArraySquaresWithUserPiece.find((squareWithUserPiece) => squareWithUserPiece.piece.name === "king"); console.log(userKingSquare);
                    const relevantRookSquare = boardArraySquaresWithUserPiece.find((squareWithUserPiece) => squareWithUserPiece.piece.name === "rook1"); console.log(relevantRookSquare);
                    if (relevantRookSquare && (userKingSquare.index === 4 && !userKingSquare.piece.moved) && (relevantRookSquare.index === 0 && !relevantRookSquare.piece.moved) && areSquaresEmpty([3, 2, 1], boardArray) && kingMovingToTheseSquaresDoesntPutHimInCheck([3, 2], 4, boardArray, isUserKingInCheck)) { // && kingMovingToTheseSquaresDoesntPutHimInCheck([3, 2], 4, boardArray, isUserKingInCheck) //🧙‍♂️it fails, for white, when added to a white & a black. There's a recursion that goes on (only then - which is strange)
                        console.log("finalWhite");
                        legalSecondarySquareIndexes.push(2);
                    }
                } else {
                    //black
                    const userKingSquare = boardArraySquaresWithUserPiece.find((squareWithUserPiece) => squareWithUserPiece.piece.name === "king");//console.log(userKingSquare);
                    const relevantRookSquare = boardArraySquaresWithUserPiece.find((squareWithUserPiece) => squareWithUserPiece.piece.name === "rook2");//console.log(relevantRookSquare);
                    if (relevantRookSquare && (userKingSquare.index === 60 && !userKingSquare.piece.moved) && (relevantRookSquare.index === 56 && !relevantRookSquare.piece.moved) && areSquaresEmpty([57, 58, 59], boardArray) && kingMovingToTheseSquaresDoesntPutHimInCheck([58, 59], 60, boardArray, isUserKingInCheck)) {// && kingMovingToTheseSquaresDoesntPutHimInCheck([58, 59], 60, boardArray, isUserKingInCheck)
                        console.log("finalBlack");
                        legalSecondarySquareIndexes.push(58);
                    }
                }
            }
            return legalSecondarySquareIndexes;
        }
    },
    castling_right: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece, { check, isUserKingInCheck, boardArray, ourColor, }) {
            const legalSecondarySquareIndexes = [];//console.log(check, isUserKingInCheck, boardArray, userColor);
            if (!check) {
                if (ourColor === "white") {
                    //white
                    const userKingSquare = boardArraySquaresWithUserPiece.find((squareWithUserPiece) => squareWithUserPiece.piece.name === "king");//console.log(userKingSquare);
                    const relevantRookSquare = boardArraySquaresWithUserPiece.find((squareWithUserPiece) => squareWithUserPiece.piece.name === "rook2");//console.log(relevantRookSquare);
                    if (relevantRookSquare && (userKingSquare.index === 4 && !userKingSquare.piece.moved) && (relevantRookSquare.index === 7 && !relevantRookSquare.piece.moved) && areSquaresEmpty([5, 6], boardArray) && kingMovingToTheseSquaresDoesntPutHimInCheck([5, 6], 4, boardArray, isUserKingInCheck)) {//&& kingMovingToTheseSquaresDoesntPutHimInCheck([5, 6], 4, boardArray, isUserKingInCheck)
                        console.log("white-final-right");
                        legalSecondarySquareIndexes.push(6);
                        //maybe only update this for real when..castlingInfo = "left";
                    }
                } else {
                    //black
                    const userKingSquare = boardArraySquaresWithUserPiece.find((squareWithUserPiece) => squareWithUserPiece.piece.name === "king");//console.log(userKingSquare);
                    const relevantRookSquare = boardArraySquaresWithUserPiece.find((squareWithUserPiece) => squareWithUserPiece.piece.name === "rook1");//console.log(relevantRookSquare);
                    if (relevantRookSquare && (userKingSquare.index === 60 && !userKingSquare.piece.moved) && (relevantRookSquare.index === 63 && !relevantRookSquare.piece.moved) && areSquaresEmpty([61, 62], boardArray) && kingMovingToTheseSquaresDoesntPutHimInCheck([61, 62], 60, boardArray, isUserKingInCheck)) { // && kingMovingToTheseSquaresDoesntPutHimInCheck([5, 6], 4, boardArray, isUserKingInCheck)
                        console.log("black-final-right");
                        legalSecondarySquareIndexes.push(62);
                        //maybe only update this for real when..castlingInfo = "left";
                    }
                }
            }
            return legalSecondarySquareIndexes;
        }
    },
    diagonal_forward_left: {
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const [valueUp, valueLeft] = [8, -1];
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
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const [valueDown, valueLeft] = [-8, -1];
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
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const [valueUp, valueRight] = [8, 1];
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
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const [valueDown, valueRight] = [-8, 1];
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
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const [valueUp, valueLeft] = [16, -1];
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
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const [valueDown, valueLeft] = [-16, -1];
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
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const [valueUp, valueRight] = [16, 1];
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
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const [valueDown, valueRight] = [-16, 1];
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
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const [valueUp, valueLeft] = [8, -2];
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
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const [valueDown, valueLeft] = [-8, -2];
            const legalSecondarySquareIndexes = [];

            //calculate squares it can hop before it reaches left-edge of board
            let counter = 0;
            for (let potentialSquare = originalSquareIndex + valueLeft; !(originalSquareIndex % 8 === 0) && !((originalSquareIndex - 1) % 8 === 0); counter++, potentialSquare--) {
                if (potentialSquare % 8 === 0 || (potentialSquare - 1) % 8 === 0) {
                    counter++;
                    break;
                }
            }

            //console.log(counter);

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
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const [valueUp, valueRight] = [8, 2];
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
        funcPrimary(total, originalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece) {
            const [valueDown, valueRight] = [-8, 2];
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
            return fatPawn;
        case "rook":
            return fatRook;
        case "knight":
            return fatKnight;
        case "bishop":
            return fatBishop;
        case "queen":
            return fatQueen;
        case "king":
            return fatKing;
        default:
            console.log("no match found!");
    }
}
//doesn't work: ♟(empty pawn)♟(black pawn)
//can-be-colored-in:⚚✝︎⏃⌵⌂

export { pieceMoveObj, directionConverterObj, returnPieceEmoji };