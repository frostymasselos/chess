import {pieceMoveObj, directionConverterObj} from '../../helper/boardHelp.js'; //refactor to include both from 1 file
import {useState, useEffect, useRef} from 'react';
import React from 'react';  

function Board({db, authInfo, position}) {

    let userColor = useRef(position === 1 ? "white" : "black");
    let opponentColor = useRef(userColor.current === "white" ? "black" : "white");
    let boardArray = useRef([]);
    let [check, setCheck] = useState(false);
    let [checkMate, setCheckMate] = useState(false);
    let [gridItems, setGridItems] = useState([]);
    let initialExecutionGridItems = useRef(true);
    let initialExecutionOnClick = useRef(true);
    let [readyToPublish, setReadyTopPublish] = useState(false);
    let clickedOnPiece = useRef(false);
    const [testRefresh, setTestRefresh] = useState(false);
    
    function fillBoardArrayWithSquares(params) {
        for (let num = 0; num < 64; num++) { //works
            boardArray.current.push({
                index: num,
                piece: null,
            })
        }
    }
    
    //1.POPULATE boardArray
    useEffect(() => {
        if (position === 2) {
            //ROTATE BOARD🐉
            let board = document.querySelector('.board-grid-container'); //works
            // board.style.setProperty("transform", "rotate(180deg)");
            console.log("rotating board");
        } else {
            console.log("not rotating board");
        }
        //BLACK ARTIFICIALLY MOVES
        // if (condition) {
            
        // }
        //FILL boardArray WITH SQUARES
        fillBoardArrayWithSquares();
        //FILL boardArray WITH PIECES
        let game = db.ref(`matches/${authInfo.authCode}`);
        let userDb = db.ref(`matches/${authInfo.authCode}/${authInfo.authUser}`);
        let opponent = '';
        authInfo.authUser === "user1" ? opponent = "user2" : opponent = "user1";
        let opponentDb = db.ref(`matches/${authInfo.authCode}/${opponent}`);
        //FILL boardArray WITH OWN PIECES
        userDb.child(`pieces`).on('value', (e) => {
            function fillBoardWithPieces(objOfPieces, dB) {
                dB.child(`pieces`).off(); //remove listener
                for (let key in objOfPieces) {
                    //if piece is alive
                    if (!objOfPieces[key].alive) {
                        continue;
                    }
                    let rowPosition = objOfPieces[key].rowPosition.slice(0, 1); //"1/2"
                    let columnPosition = objOfPieces[key].columnPosition.slice(0, 1); //"6/7"
                    let index = (8 - rowPosition) * 8 + (columnPosition - 1);
                    for (let square of boardArray.current) {
                        if (index === square.index) { 
                            square.piece = objOfPieces[key];
                            break;
                        }
                    }
                }
            }
            fillBoardWithPieces(e.val(), userDb);
            opponentDb.child(`pieces`).on('value', (e) => {
                fillBoardWithPieces(e.val(), opponentDb);
                console.log("boardArray.current:", boardArray.current);
                // if (userColor.current === "black") {
                //     const duplicate = [...boardArray.current.reverse()];
                //     for (const square of duplicate) {
                //         square.index = 63 - square.index;
                //         if (square.piece) {
                //             const newRowPosition = 9 - Number.parseInt(square.piece.rowPosition[0])
                //             square.piece.rowPosition = `${newRowPosition}/${newRowPosition + 1}`;
                //             const newColumnPosition = 9 - Number.parseInt(square.piece.columnPosition[0])
                //             square.piece.columnPosition = `${newColumnPosition}/${newColumnPosition + 1}`;
                //         }
                //     }
                //     boardArray.current = duplicate;
                // }
                //RENDER PIECES ON BOARD
                renderPieces();
                //IS IT USER'S TURN?
                userDb.child(`canMove`).orderByKey().on('value', (e) => {
                    if (e.val()) {
                        const board = window.document.querySelector(`.board-grid-container`); //console.log("board:", board);
                        board.classList.remove(`unclickable`);
                    }
                })
            })
        });
    }, []);

    // //2.RENDER PIECES ON BOARD //🐉Remember good question about timing
    function renderPieces(params) { 
        //MAKE PIECES
        let arrayOfJSXPieces = [];
        for (const item of boardArray.current) {
            // if square has piece 
            if (item.piece) {
                let styleVal = {
                    gridRow: `${item.piece.rowPosition}`,
                    gridColumn:`${item.piece.columnPosition}`,
                }
                let gridItem = (
                    <div id={`${item.piece.white ? "white" : "black"}${item.piece.name}`} className={item.piece.white ? "white" : "black"} data-color={item.piece.white ? "white" : "black"} style={styleVal} key={Math.random()}>
                    {item.piece.name}</div>
                    );
                arrayOfJSXPieces.push(gridItem);
            }
        }
        //MAKES SQUARES & NEST PIECES IN SQUARES
        let arrayOfJSXSquares = [];
        for (let index = 0, row = 8, col = 1; index < 64; index++, col++) {
            let potentialPiece = null;
            //loop through pieces to see if co-ordinates match with square
            for (const piece of arrayOfJSXPieces) {
                if (Number.parseInt(piece.props.style.gridColumn.slice(0, 1)) === col && Number.parseInt(piece.props.style.gridRow.slice(0, 1)) === row) {
                    potentialPiece = piece;
                    break;
                }
            }
            let styleVal = {
                gridRow: `${row}`,
                gridColumn:`${col}`,
            }
            let square = (
            <div id={index} data-square style={styleVal} onClick={onClickHandler} key={Math.random()}>
                {potentialPiece}
            </div>
            );
            arrayOfJSXSquares.push(square);
            //should we reset
            if (col === 8) {
                col = 0;
                row--;
            }
        }
        setGridItems(arrayOfJSXSquares);
    }

    //2.5 CODE TO EXECUTE WHEN THINGS'RE RENDERED ON BOARD
    useEffect(() => {
        //don't execute on initial execution
        if (initialExecutionGridItems.current) {
            initialExecutionGridItems.current = false;
            return;
        }
        //are we in check (could opponent kill our king on their next go if none of our pieces moved)?
        if (isKingInCheck()) {
            const squaresWithUserAndOpponentPieces = returnSquaresWithUserAndOpponentPieces(boardArray.current);
            const squaresWithUserPieces = squaresWithUserAndOpponentPieces[0];
            const squaresWithOpponentPieces = squaresWithUserAndOpponentPieces[1];
            if (isInCheckmate(squaresWithUserPieces, squaresWithOpponentPieces)) {
                setCheckMate(true);
            } else {
                setCheck(true);
            }
        }
        // is opponent in check? (if we get this code right, move it to onClick handler)
        // if (isKingInCheck(boardArray.current, opponentColor.current, userColor.current)) {
        //     console.log("opponent king in check");
        // } else {
        //     console.log("opponent king not in check");
        // }
        // checks if opponent in check|check-mate after move
        // if (isKingInCheck(boardArray.current, opponentColor.current, userColor.current)) {
        //     const squaresWithUserAndOpponentPieces = returnSquaresWithUserAndOpponentPieces(boardArray.current, opponentColor.current);
        //     const squaresWithUserPieces = squaresWithUserAndOpponentPieces[0];
        //     const squaresWithOpponentPieces = squaresWithUserAndOpponentPieces[1];
        //     if (isInCheckmate(squaresWithUserPieces, squaresWithOpponentPieces, opponentColor.current, userColor.current)) {
        //         // setCheckMate(true);
        //         console.log("opponent is in checkmate");
        //     } else {
        //         // setCheck(true);
        //         console.log("opponent is in check");
        //     }
        // }
    }, [gridItems])

    //3.ONCLICKHANDLER
    function onClickHandler(e) {
        // e.stopPropagation();
        if (clickedOnPiece.current) { 
            //SECONDARY CLICK
            console.log("2nd stage");
            //identify original & secondary square indexes in array.
            let originalPiece = clickedOnPiece.current.piece;
            if (e.target.id === clickedOnPiece.current.id) {
                //SAME PIECE: DESELECT
                //unhighlight
                clickedOnPiece.current.piece.classList.remove(`highlighted`);
                //reset state
                clickedOnPiece.current = false;
                console.log("piece deselected");
                return;
            } 
            if (e.target.dataset.color === clickedOnPiece.current.color) { //✅
                //OUR PIECE: INVALID
                const secondaryPiece = e.target;
                //unhighlight orginal piece
                originalPiece.classList.remove(`highlighted`);
                //highlight clicked on piece
                e.target.classList.add(`highlighted`);
                //reset state
                clickedOnPiece.current = {color: secondaryPiece.dataset.color, id: secondaryPiece.id, square: e.currentTarget, piece: secondaryPiece};
                // clickedOnPiece.current = {color: piece.dataset.color, id: piece.id, square: e.currentTarget, piece: e.target}; console.log("clickedOnPiece.current:", clickedOnPiece.current);
                console.log("invalid - moving on our piece.", "new state:", clickedOnPiece.current);
                return;
            } 
            function returnBoardArrayIndex(square) {
                const rowPosition = window.getComputedStyle(square).getPropertyValue('grid-row').slice(0, 1); //console.log(rowPosition);
                const columnPosition = window.getComputedStyle(square).getPropertyValue('grid-column').slice(0, 1);
                return (8 - rowPosition) * 8 + (columnPosition - 1); 
            }
            const originalSquareId = clickedOnPiece.current.id;
            const originalSquareIndex = returnBoardArrayIndex(clickedOnPiece.current.square); console.log("originalSquareIndex:", originalSquareIndex);
            const secondarySquareIndex = returnBoardArrayIndex(e.currentTarget); console.log("secondarySquareIndex:", secondarySquareIndex);
            //all squares with userPieces & all squares with opponentPieces
            const squaresWithUserAndOpponentPieces = returnSquaresWithUserAndOpponentPieces();
            const [squaresWithUserPieces, squaresWithOpponentPieces] = [squaresWithUserAndOpponentPieces[0], squaresWithUserAndOpponentPieces[1]]; //console.log("squaresWithUserPieces:", squaresWithUserPieces); console.log("squaresWithOpponentPieces:", squaresWithOpponentPieces)
            const pieceMovingInArray = squaresWithUserPieces[originalSquareIndex].piece; //console.log(pieceMovingInArray);
            //all geographically legal secondary square indexes
            const geographicallyLegalSecondarySquareIndexes = arrayOfGeographicallyLegalSquares(originalSquareId, originalSquareIndex, squaresWithUserPieces, squaresWithOpponentPieces); console.log("geographicallyLegalSecondarySquareIndexes:", geographicallyLegalSecondarySquareIndexes);
            //all geographically legal secondary square indexes of all opponentPieces
            // const geographicallyLegalSecondarySquareIndexesOfAllUserPieces = arrayOfGeographicallyLegalSquaresOfAllUserPieces(squaresWithOpponentPieces, squaresWithUserPieces, opponentColor.current); console.log("geographicallyLegalSecondarySquareIndexesOfAllPieces:", geographicallyLegalSecondarySquareIndexesOfAllUserPieces);
            if (!geographicallyLegalSecondarySquareIndexes.some(legalSquareIndex => legalSquareIndex === secondarySquareIndex)) {
                //GEOGRAPHICALLY ILLEGAL MOVE OR PUTS KING IN CHECK|CHECKMATE
                console.log("illegal geography");
                e.preventDefault();
                return;
            }
            //imagine original piece has successfully moved to second square (copy array, and reassign secondsquarepiece to originalpiece)
            const board2 = JSON.parse(JSON.stringify(boardArray.current));;
            board2[secondarySquareIndex].piece = board2[originalSquareIndex].piece;
            board2[originalSquareIndex].piece = null; //console.log("board2", board2);
            if (isKingInCheck(board2)) {
                console.log("illegal move - king is in check");
                e.preventDefault();
                return;
            }
            //EXECUTING USER'S CLICK
            //freeze board
            const board = window.document.querySelector(`.board-grid-container`); //console.log("board:", board);
            board.classList.add(`unclickable`);
            clickedOnPiece.current = false;
            function executeUserClick() {
                console.log("executing", "original piece:", originalPiece);
                if (e.target.dataset.square) {
                    //SECOND SQUARE IS AN EMPTY SQUARE
                    let emptySquare = e.target;
                    emptySquare.append(originalPiece);
                    console.log("secondaryEl is an empty square:", e.target);
                    unhighlightAndResetClickedOnPiece();
                    
                } else {
                    //SECOND SQUARE HAS AN ENEMY PIECE
                    const enemyPiece = e.target;
                    const enemyPieceSquare = e.currentTarget;
                    //kill enemy
                    enemyPiece.remove();
                    //append originalPiece
                    enemyPieceSquare.append(originalPiece);
                    // setTimeout(() => {
                    //     enemyPiece.classList.add(`fizzle`);
                    // }, 2000);
                    unhighlightAndResetClickedOnPiece();
                }
                //send this info to db full grid-area property to dB property. 
                function unhighlightAndResetClickedOnPiece() {
                    //unhighlight original piece
                    originalPiece.classList.remove(`highlighted`);
                    //CHECK IF PIECE MOVING IS PAWN
                    //CHECK IF OPPONENT'S KING'S IN CHECK|CHECKMATE
                    const board2 = JSON.parse(JSON.stringify(boardArray.current));
                    board2[secondarySquareIndex].piece = board2[originalSquareIndex].piece;
                    board2[originalSquareIndex].piece = null;
                    // if (isKingInCheck(board2, opponentColor.current, userColor.current)) {
                    //     console.log("opponent king in check");
                    // } else {
                    //     console.log("opponent king not in check");
                    // }
                    // if (isKingInCheck(boardArray.current, opponentColor.current, userColor.current)) {
                    //     const squaresWithUserAndOpponentPieces = returnSquaresWithUserAndOpponentPieces(boardArray.current, opponentColor.current);
                    //     const squaresWithUserPieces = squaresWithUserAndOpponentPieces[0];
                    //     const squaresWithOpponentPieces = squaresWithUserAndOpponentPieces[1];
                    //     if (isInCheckmate(squaresWithUserPieces, squaresWithOpponentPieces, opponentColor.current, userColor.current)) {
                    //         // setCheckMate(true);
                    //         console.log("opponent is in checkmate");
                    //     } else {
                    //         // setCheck(true);
                    //         console.log("opponent is in check");
                    //     }
                    // }
                    //CHANGE STATE TO TRIGGER PUBLISH FUNCTION
                    let userDb = db.ref(`matches/${authInfo.authCode}/${authInfo.authUser}`);
                    async function updateDb(params) {
                        //update pawn. if pawn, if notMoved, update db 
                        if (pieceMovingInArray.name.includes(`pawn`) && !pieceMovingInArray.moved) {
                            console.log("here");
                            await userDb.child(`pieces/${pieceMovingInArray.name}`).update({
                                moved: true
                            })
                        }
                        //canMove must be false. moved must be updated. 
                        // await userDb.update({
                        //     canMove: false
                        // }); //console.log("attempted update");
                        // await userDb.update({
                        //     moved: Math.random()
                        // })
                        // reset state? No need..so far. 
                    }
                    updateDb();
                } 
            }
            executeUserClick();
        } else {
            //HAVEN'T PREVIOUSLY CLICKED PIECE (FRESH)
            console.log("1st stage");
            if (e.target.dataset.square || e.target.dataset.color !== userColor.current) {
                //PRIMARY CLICK ON EMPTY SQUARE OR OPPONENT PIECE OR OFF-BOARD
                console.log("clicked on empty square or opponent piece");
                e.preventDefault();
                return;
            } else {
                //PRIMARY CLICK ON OWN PIECE
                let piece = e.target;
                //REGISTER, IN STATE, INFO ON PIECE CLICKED ON
                clickedOnPiece.current = {color: piece.dataset.color, id: piece.id, square: e.currentTarget, piece: e.target};  
                //HIGHLIGHT SQUARE/PIECE
                piece.classList.add(`highlighted`);
            }
        }
    }

    //4. LEGAL-MOVE LOGIC HELPER FUNCTIONS
    function returnSquaresWithUserAndOpponentPieces(board = boardArray.current, ourColor = userColor.current) {
        let both = [];
        const boardArraySquaresWithOpponentPiece = [];
        const boardArraySquaresWithUserPiece = board.filter((square) => {
            if (square.piece) {
                let pieceColor = ''; 
                square.piece.white === true ? pieceColor = "white" : pieceColor = "black";
                if (pieceColor === ourColor) {
                    return true
                } else {
                    boardArraySquaresWithOpponentPiece.push(square);
                }
            
            }
        }); //console.log(boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece); //✅
        both = [[...boardArraySquaresWithUserPiece], [...boardArraySquaresWithOpponentPiece]]; //console.log(both);✅
        return both;
    }
    function arrayOfGeographicallyLegalSquares(pieceId, originalSquareIndex, squaresWithUserPieces, squaresWithOpponentPieces, ourColor = userColor.current) {
        const allLegalSecondarySquareIndexes = [];
        const pieceType = Object.keys(pieceMoveObj.white).find((key) => pieceId.includes(`${key}`)); //console.log("pieceType:", pieceType);
        let total = '';
        if (pieceType === "pawn") {
            let squareWithPawnPiece = squaresWithUserPieces.find((squareWithUserPiece) => squareWithUserPiece.index === originalSquareIndex); //console.log("squareWithPawnPiece", squareWithPawnPiece);
            squareWithPawnPiece.piece.moved ? total = 1 : total = 2            
        } else {
            total = pieceMoveObj[ourColor][pieceType].total.primary; //console.log("total:", total);
        }
        for (const move of pieceMoveObj[ourColor][pieceType].direction) { //console.log("move:", move);
            for (const direction in directionConverterObj) {
                if (move === direction) {
                    const moveLegalSecondaryIndexes = directionConverterObj[direction].funcPrimary(total, originalSquareIndex, squaresWithUserPieces, squaresWithOpponentPieces); //console.log(moveLegalSecondaryIndexes);  
                    moveLegalSecondaryIndexes.forEach((index) => allLegalSecondarySquareIndexes.push(index))
                }
            }
        } //console.log(allLegalSecondarySquareIndexes);
        return allLegalSecondarySquareIndexes;
    } 
    function arrayOfGeographicallyLegalSquaresOfAllUserPieces(squaresWithUserPieces, squaresWithOpponentPieces, ourColor = userColor.current) {
        const geographicallyLegalSquaresOfAllPieces = [];
        for (const squareWithUserPiece of squaresWithUserPieces) {
            const pieceId = squareWithUserPiece.piece.name; //console.log(pieceId)
            const originalSquareIndex = squareWithUserPiece.index; //console.log(originalSquareIndex);
            const geographicallyLegalSquaresOfParticularPiece = arrayOfGeographicallyLegalSquares(pieceId, originalSquareIndex, squaresWithUserPieces, squaresWithOpponentPieces, ourColor);
            geographicallyLegalSquaresOfParticularPiece.forEach((legalSquare) => geographicallyLegalSquaresOfAllPieces.push(legalSquare));
            geographicallyLegalSquaresOfAllPieces.push()
        }
        return geographicallyLegalSquaresOfAllPieces;
    }  
    function isKingInCheck(board = boardArray.current, ourColor = userColor.current, enemyColor = opponentColor.current) {
        //square index of user king
        const squaresWithUserAndOpponentPieces = returnSquaresWithUserAndOpponentPieces(board, ourColor);
        const squaresWithUserPieces = squaresWithUserAndOpponentPieces[0];
        const squaresWithOpponentPieces = squaresWithUserAndOpponentPieces[1];
        let squareIndexOfUserKing = ''; squaresWithUserPieces.some((userSquare) => userSquare.piece.name === "king" ? squareIndexOfUserKing = userSquare.index : null); //console.log("squareIndexOfUserKing:", squareIndexOfUserKing);
        //cycle through every potential secondary square of opponent piece and if any potential secondary squares = square of our king, illegal move
        const arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces = arrayOfGeographicallyLegalSquaresOfAllUserPieces(squaresWithOpponentPieces, squaresWithUserPieces, enemyColor); console.log("arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces:", arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces);
        return arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces.some((legalSquareOfOpponentPiece) => {return legalSquareOfOpponentPiece === squareIndexOfUserKing;});
    }
    function isInCheckmate(squaresWithUserPieces, squaresWithOpponentPieces, ourColor = userColor.current, enemyColor = opponentColor.current) {
        //for every possible move I make, am I still in check? Make a new board for each move and assess whether I'm still in check
        for (const squareWithUserPiece of squaresWithUserPieces) {
            const pieceId = squareWithUserPiece.piece.name; //console.log(pieceId)
            const originalSquareIndex = squareWithUserPiece.index; //console.log(originalSquareIndex);
            const geographicallyLegalSquareIndicesOfParticularPiece = arrayOfGeographicallyLegalSquares(pieceId, originalSquareIndex, squaresWithUserPieces, squaresWithOpponentPieces, ourColor); console.log("geographicallyLegalSquareIndicesOfParticularPiece", geographicallyLegalSquareIndicesOfParticularPiece);
            for (const secondarySquareIndex of geographicallyLegalSquareIndicesOfParticularPiece) {
                //make new board
                const board2 = JSON.parse(JSON.stringify(boardArray.current));
                board2[secondarySquareIndex].piece = board2[originalSquareIndex].piece;
                board2[originalSquareIndex].piece = null; //console.log("board2", board2);
                //ask question of new board
                if (!isKingInCheck(board2, ourColor, enemyColor)) {
                    return false;
                }
            } 
        }
        return true;
    }

    //5. MISC HELPER FUNCTIONS
    function testy() {
        setTestRefresh(true);
    }

    return (
        <>
            {check && <div>You are in check</div>}
            {checkMate && <div>You are in checkmate</div>}
            <div className="board-grid-container unclickable">
                {gridItems}
            </div>
            {/* <div onClick={testy}>Click to test refresh</div> */}
            {/* {testRender()} */}
            {/* {testRender} */}
            {/* {testy.current} */}
            {/* {testyTag} */}
        </>
    )

}

export default Board;