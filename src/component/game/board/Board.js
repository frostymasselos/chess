import {pieceMoveObj, directionConverterObj} from '../../../helper/boardHelp.js'; 
import {useState, useEffect, useRef} from 'react';
import React from 'react';  

function Board({db, authInfo, canMove, setCanMove, triggerBoardUseEffect}) {

    let [check, setCheck] = useState(false);
    let [checkMate, setCheckMate] = useState(false);
    let [squareTags, setSquareTags] = useState([]);
    let [showingUserPiecesPotentialMoves, setShowingUserPiecesPotentialMoves] = useState(false);
    let [showingOpponentPiecesPotentialMoves, setShowingOpponentPiecesPotentialMoves] = useState(false);
    let [showingClickedOnPiecePotentialMoves, setShowingClickedOnPiecePotentialMoves] = useState(false);
    // let showingClickedOnPiecePotentialMovesUseRef = useRef(showingClickedOnPiecePotentialMoves ? true : false);
    
    let opponentColor = useRef(authInfo.color === "white" ? "black" : "white");
    let boardArray = useRef([]);
    let clickedOnPiece = useRef(false);

    console.log(showingClickedOnPiecePotentialMoves);

    function fillBoardArrayWithSquares() {
        boardArray.current = [];
        for (let num = 0; num < 64; num++) { //works
            boardArray.current.push({
                index: num,
                piece: null,
            })
        }
    }
    function renderPieces() { 
        //make pieces
        let arrayOfJSXPieces = [];
        for (const square of boardArray.current) {
            // if square has piece 
            if (square.piece) {
                let styleVal = {
                    gridRow: `${square.piece.rowPosition}`,
                    gridColumn:`${square.piece.columnPosition}`,
                }
                let piece = (
                    <div id={`${square.piece.white ? "white" : "black"}${square.piece.name}`} className={square.piece.white ? "white" : "black"} data-color={square.piece.white ? "white" : "black"} style={styleVal} key={Math.random()}>
                        {square.piece.name}
                    </div>
                );
                arrayOfJSXPieces.push(piece);
            }
        }
        //make squares & nest pieces in squares
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
            <div id={`i${index}`} data-square style={styleVal} onClick={onClickHandler} key={Math.random()}>
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
        setSquareTags(arrayOfJSXSquares);
    }
    function decideToTurnOnOrOffClickedOnPiecePotentialMovesButton(params) {
        if (showingClickedOnPiecePotentialMoves) {
            setShowingClickedOnPiecePotentialMoves(false);
        } else {
            setShowingClickedOnPiecePotentialMoves(true);
        }
    }
    function simpleHighlightSquares(indices) {
        for (const index of indices) {
            let squareToHighlight = window.document.querySelector(`#i${index}`);
            // console.log(squareToHighlight);
            squareToHighlight.classList.add(`potentialClickedOnPieceSquare`);
        }
    }
    function highlightSquares(player) {
        const squaresWithUserAndOpponentPieces = returnSquaresWithUserAndOpponentPieces();
        const [squaresWithUserPieces, squaresWithOpponentPieces] = [squaresWithUserAndOpponentPieces[0], squaresWithUserAndOpponentPieces[1]]; //console.log(squaresWithUserPieces); //console.log(squaresWithOpponentPieces);
        const arrayOfGeographicallyLegalSquareIndicesOfAllUserPieces = arrayOfGeographicallyLegalSquaresOfAllUserPieces(squaresWithUserPieces, squaresWithOpponentPieces, authInfo.color); //console.log("arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces:", arrayOfGeographicallyLegalSquareIndicesOfAllUserPieces);
        const arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces = arrayOfGeographicallyLegalSquaresOfAllUserPieces(squaresWithOpponentPieces, squaresWithUserPieces, opponentColor.current); console.log("arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces:", arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces);
        
        if (showingUserPiecesPotentialMoves && player === "user") {
            for (const squareIndex of arrayOfGeographicallyLegalSquareIndicesOfAllUserPieces) {
                const square = window.document.querySelector(`#i${squareIndex}`);
                square.classList.remove(`potentialUserSquare`);
            }
            // showingUserPiecesPotentialMoves.current = false;
            setShowingUserPiecesPotentialMoves(false);
            return;
        } 
        
        if (showingOpponentPiecesPotentialMoves && player === "opponent") {
            for (const squareIndex of arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces) {
                const square = window.document.querySelector(`#i${squareIndex}`);
                square.classList.remove(`potentialOpponentSquare`);
            }
            // showingOpponentPiecesPotentialMoves.current = false;
            setShowingOpponentPiecesPotentialMoves(false);
            return;
        }
        
        let squareIndices = '';
        if (player === "user") {
            squareIndices = arrayOfGeographicallyLegalSquareIndicesOfAllUserPieces;
            // showingUserPiecesPotentialMoves.current = true;
            setShowingUserPiecesPotentialMoves(true);
        } else {
            squareIndices = arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces;
            // showingOpponentPiecesPotentialMoves.current = true;
            setShowingOpponentPiecesPotentialMoves(true);
        }
        
        for (const potentialSquareIndex of squareIndices) {
            for (const square of boardArray.current) {
                if (potentialSquareIndex === square.index) {
                    let squareToHighlight = window.document.querySelector(`#i${potentialSquareIndex}`);
                    if (player === "user") {
                        squareToHighlight.classList.add(`potentialUserSquare`);
                    } else {
                        squareToHighlight.classList.add(`potentialOpponentSquare`);
                    }
                }
            }
        }
    }
    async function publishMove(userDb) {
        await userDb.update({canMove: false, moved: Math.random()}); 
        setCanMove(false);
    }

    //legal-move-logic helper functions
    function returnSquaresWithUserAndOpponentPieces(board = boardArray.current, ourColor = authInfo.color) {
        let both = [];
        const boardArraySquaresWithOpponentPiece = [];
        const boardArraySquaresWithUserPiece = board.filter((square) => {
            if (square.piece) {
                let pieceColor = square.piece.white === true ? "white" : "black";
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
    function arrayOfGeographicallyLegalSquares(pieceId, originalSquareIndex, squaresWithUserPieces, squaresWithOpponentPieces, ourColor = authInfo.color) {
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
    function arrayOfGeographicallyLegalSquaresOfAllUserPieces(squaresWithUserPieces, squaresWithOpponentPieces, ourColor = authInfo.color) {
        const geographicallyLegalSquaresOfAllPieces = [];
        for (const squareWithUserPiece of squaresWithUserPieces) {
            const geographicallyLegalSquaresOfParticularPiece = arrayOfGeographicallyLegalSquares(squareWithUserPiece.piece.name, squareWithUserPiece.index, squaresWithUserPieces, squaresWithOpponentPieces, ourColor);
            geographicallyLegalSquaresOfParticularPiece.forEach((legalSquare) => geographicallyLegalSquaresOfAllPieces.push(legalSquare));
        }
        return geographicallyLegalSquaresOfAllPieces;
    }  
    function isUserKingInCheck(board = boardArray.current, ourColor = authInfo.color, enemyColor = opponentColor.current) {
        //square index of user king
        const squaresWithUserAndOpponentPieces = returnSquaresWithUserAndOpponentPieces(board, ourColor);
        const [squaresWithUserPieces, squaresWithOpponentPieces] = [squaresWithUserAndOpponentPieces[0], squaresWithUserAndOpponentPieces[1]]; //console.log(squaresWithUserPieces); //console.log(squaresWithOpponentPieces);
        let squareIndexOfUserKing = ''; squaresWithUserPieces.forEach((userSquare) => userSquare.piece.name === "king" ? squareIndexOfUserKing = userSquare.index : null); //console.log("squareIndexOfUserKing:", squareIndexOfUserKing);
        //cycle through every potential secondary square of opponent piece and if any potential secondary squares = square of our king, check
        const arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces = arrayOfGeographicallyLegalSquaresOfAllUserPieces(squaresWithOpponentPieces, squaresWithUserPieces, enemyColor); //console.log("arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces:", arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces);
        return arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces.some((legalSquareIndexOfOpponentPiece) => {return legalSquareIndexOfOpponentPiece === squareIndexOfUserKing;});
    }
    function isUserInCheckmate(squaresWithUserPieces, squaresWithOpponentPieces, ourColor = authInfo.color, enemyColor = opponentColor.current) {
        //for every possible move I make, am I still in check? Make a new board for each move and assess whether I'm still in check
        for (const squareWithUserPiece of squaresWithUserPieces) {
            const originalSquareIndex = squareWithUserPiece.index;
            const geographicallyLegalSquareIndicesOfParticularPiece = arrayOfGeographicallyLegalSquares(squareWithUserPiece.piece.name, originalSquareIndex, squaresWithUserPieces, squaresWithOpponentPieces, ourColor); console.log("geographicallyLegalSquareIndicesOfParticularPiece", geographicallyLegalSquareIndicesOfParticularPiece);
            for (const secondarySquareIndex of geographicallyLegalSquareIndicesOfParticularPiece) {
                //make new board
                const board2 = JSON.parse(JSON.stringify(boardArray.current));
                board2[secondarySquareIndex].piece = board2[originalSquareIndex].piece;
                board2[originalSquareIndex].piece = null; //console.log("board2", board2);
                //ask question of new board
                if (!isUserKingInCheck(board2, ourColor, enemyColor)) {
                    return false;
                }
            } 
        }
        return true;
    }
    function onClickHandler(e) {
        if (clickedOnPiece.current) { 
            console.log("2nd stage");
            const allSquareTags = Array.from(window.document.querySelectorAll(`.board-grid-container > div`));
            const originalPiece = clickedOnPiece.current.piece;//console.log(originalPiece);
            const originalSquareId = clickedOnPiece.current.id;
            const originalSquareIndex = Number.parseFloat(clickedOnPiece.current.square.id.slice(1)); //console.log(originalSquareIndex);
            const secondarySquareIndex = Number.parseFloat(e.currentTarget.id.slice(1)); //console.log(secondarySquareIndex);
            const squaresWithUserAndOpponentPieces = returnSquaresWithUserAndOpponentPieces();
            const [squaresWithUserPieces, squaresWithOpponentPieces] = [squaresWithUserAndOpponentPieces[0], squaresWithUserAndOpponentPieces[1]]; //console.log("squaresWithUserPieces:", squaresWithUserPieces); console.log("squaresWithOpponentPieces:", squaresWithOpponentPieces)
            const boardArrayOriginalPiece = squaresWithUserPieces.find((squareWithUserPiece) => squareWithUserPiece.index === originalSquareIndex).piece; console.log(boardArrayOriginalPiece);
            const geographicallyLegalSecondarySquareIndices = arrayOfGeographicallyLegalSquares(originalSquareId, originalSquareIndex, squaresWithUserPieces, squaresWithOpponentPieces); console.log("geographicallyLegalSecondarySquareIndices:", geographicallyLegalSecondarySquareIndices);
            // const geographicallyLegalSecondarySquareIndicesOfAllUserPieces = arrayOfGeographicallyLegalSquaresOfAllUserPieces(squaresWithOpponentPieces, squaresWithUserPieces, opponentColor.current); console.log("geographicallyLegalSecondarySquareIndicesOfAllPieces:", geographicallyLegalSecondarySquareIndicesOfAllUserPieces);
            if (e.target.id === clickedOnPiece.current.id) {
                //clicked on same square
                console.log("piece deselected");
                clickedOnPiece.current.piece.classList.remove(`highlighted`);
                allSquareTags.forEach((squareTag) => squareTag.classList.remove(`potentialClickedOnPieceSquare`));
                clickedOnPiece.current = false;
                return;
            } 
            if (e.target.dataset.color === clickedOnPiece.current.color) { 
                //clicked on fellow piece
                const secondaryPiece = e.target;
                originalPiece.classList.remove(`highlighted`);
                secondaryPiece.classList.add(`highlighted`);
                if (showingClickedOnPiecePotentialMoves.current) {
                    const geographicallyLegalSecondarySquareIndicesOfClickedOnPiece = arrayOfGeographicallyLegalSquares(secondaryPiece.id, Number.parseFloat(e.currentTarget.id.slice(1)), squaresWithUserPieces, squaresWithOpponentPieces); //console.log("geographicallyLegalSecondarySquareIndices:", geographicallyLegalSecondarySquareIndices);
                    allSquareTags.forEach((squareTag) => squareTag.classList.remove(`potentialClickedOnPieceSquare`));
                    simpleHighlightSquares(geographicallyLegalSecondarySquareIndicesOfClickedOnPiece);
                }
                clickedOnPiece.current = {color: secondaryPiece.dataset.color, id: secondaryPiece.id, square: e.currentTarget, piece: secondaryPiece};
                console.log("reselected piece"); //"new state:", clickedOnPiece.current);
                return;
            } 
            if (!geographicallyLegalSecondarySquareIndices.some(legalSquareIndex => legalSquareIndex === secondarySquareIndex)) {
                //GEOGRAPHICALLY ILLEGAL MOVE OR PUTS KING IN CHECK|CHECKMATE
                console.log("illegal geography");
                e.preventDefault();
                return;
            }
            //imagine original piece has successfully moved to secondary square
            const board2 = JSON.parse(JSON.stringify(boardArray.current));
            board2[secondarySquareIndex].piece = board2[originalSquareIndex].piece;
            board2[originalSquareIndex].piece = null; //console.log("board2", board2);
            if (isUserKingInCheck(board2)) {
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
                    // if (isUserKingInCheck(board2, opponentColor.current, authInfo.color.current)) {
                    //     console.log("opponent king in check");
                    // } else {
                    //     console.log("opponent king not in check");
                    // }
                    // if (isUserKingInCheck(boardArray.current, opponentColor.current, authInfo.color.current)) {
                    //     const squaresWithUserAndOpponentPieces = returnSquaresWithUserAndOpponentPieces(boardArray.current, opponentColor.current);
                    //     const squaresWithUserPieces = squaresWithUserAndOpponentPieces[0];
                    //     const squaresWithOpponentPieces = squaresWithUserAndOpponentPieces[1];
                    //     if (isUserInCheckmate(squaresWithUserPieces, squaresWithOpponentPieces, opponentColor.current, authInfo.color.current)) {
                    //         // setCheckMate(true); console.log("opponent is in checkmate");
                               // db.ref(`matches/${authInfo.url}/winner`).update({
                                    // winner: authInfo.user
                                    // return;
                               // });
                    //     } else {
                    //         // setCheck(true); console.log("opponent is in check");
                    //     }
                    // }
                    //CHANGE STATE TO TRIGGER PUBLISH FUNCTION
                    let userDb = db.ref(`matches/${authInfo.url}/${authInfo.user}`);
                    (async function updateDbPieces(params) {
                        //update pawn. if pawn, if notMoved, update db 
                        if (boardArrayOriginalPiece.name.includes(`pawn`) && !boardArrayOriginalPiece.moved) {
                            console.log("here");
                            await userDb.child(`pieces/${boardArrayOriginalPiece.name}`).update({
                                moved: true
                            })
                        }
                    })();
                    publishMove(userDb);
                    //🐉 change dbPieces. piecename as it'd appear in db. grid-row/column. 

                } 
            }
            executeUserClick();
        } else {
            //haven't previously clicked on piece
            console.log("1st stage"); 
            if (e.target.dataset.square || e.target.dataset.color !== authInfo.color) {
                console.log("clicked on empty square or opponent piece");
                e.preventDefault();
                return;
            } else {
                //clicked on piece
                let piece = e.target;
                clickedOnPiece.current = {color: piece.dataset.color, id: piece.id, square: e.currentTarget, piece: e.target};  
                piece.classList.add(`highlighted`);
                //highlight potential squares
                console.log("here");
                if (showingClickedOnPiecePotentialMoves) { console.log("here2"); //showingClickedOnPiecePotentialMoves
                    const squaresWithUserAndOpponentPieces = returnSquaresWithUserAndOpponentPieces();
                    const [squaresWithUserPieces, squaresWithOpponentPieces] = [squaresWithUserAndOpponentPieces[0], squaresWithUserAndOpponentPieces[1]]; //console.log("squaresWithUserPieces:", squaresWithUserPieces); console.log("squaresWithOpponentPieces:", squaresWithOpponentPieces)
                    const geographicallyLegalSecondarySquareIndices = arrayOfGeographicallyLegalSquares(piece.id, Number.parseFloat(e.currentTarget.id.slice(1)), squaresWithUserPieces, squaresWithOpponentPieces); //console.log("geographicallyLegalSecondarySquareIndices:", geographicallyLegalSecondarySquareIndices);
                    simpleHighlightSquares(geographicallyLegalSecondarySquareIndices);
                }
            }
        }
    }

    //0.freeze/unfreeze board
    useEffect(() => { 
        const board = window.document.querySelector(`.board-grid-container`); //console.log("board:", board);
        if (canMove) {
            board.classList.remove(`unclickable`);
        } else {
            board.classList.add(`unclickable`);
        }
    }, [canMove]);
    
    //1.populate boardArray & ui
    useEffect(() => {
        //rotate board for black
        // if (authInfo.color === "black") { 
        //     console.log("rotating board");
        //     let board = document.querySelector('.board-grid-container');
        //     board.style.setProperty("transform", "rotate(180deg)");
        // } else { console.log("not rotating board");
        // }
        fillBoardArrayWithSquares();
        //fill board array with pieces
        let game = db.ref(`matches/${authInfo.url}`);
        let opponent = authInfo.user === "user1" ? "user2" : "user1";
        game.on('value', (e) => {
            game.off(); //remove listener
            function fillBoardWithPieces(objOfPieces) {
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
            fillBoardWithPieces(e.val().user1.pieces);
            fillBoardWithPieces(e.val().user2.pieces);
            console.log("boardArray.current:", boardArray.current);
            renderPieces();
        });
    }, [triggerBoardUseEffect]);

    //2.execute when square tags're rendered
    useEffect(() => { console.log("checking for check/checkmate");
        //are we in check (could opponent kill our king on their next go if none of our pieces moved)?
        if (isUserKingInCheck()) {
            const squaresWithUserAndOpponentPieces = returnSquaresWithUserAndOpponentPieces(boardArray.current); console.log(squaresWithUserAndOpponentPieces);
            const squaresWithUserPieces = squaresWithUserAndOpponentPieces[0]; console.log(squaresWithUserPieces);
            const squaresWithOpponentPieces = squaresWithUserAndOpponentPieces[1]; console.log(squaresWithOpponentPieces);
            if (isUserInCheckmate(squaresWithUserPieces, squaresWithOpponentPieces)) {
                setCheckMate(true);
                db.ref(`matches/${authInfo.url}`).update({winner: `${authInfo.color} ${authInfo.user}`});
            } else {
                setCheck(true);
            }
        }
        // is opponent in check? (if we get this code right, move it to onClick handler)
        // if (isUserKingInCheck(boardArray.current, opponentColor.current, authInfo.color.current)) {
        //     console.log("opponent king in check");
        // } else {
        //     console.log("opponent king not in check");
        // }
        // checks if opponent in check|check-mate after move
        // if (isUserKingInCheck(boardArray.current, opponentColor.current, authInfo.color.current)) {
        //     const squaresWithUserAndOpponentPieces = returnSquaresWithUserAndOpponentPieces(boardArray.current, opponentColor.current);
        //     const squaresWithUserPieces = squaresWithUserAndOpponentPieces[0];
        //     const squaresWithOpponentPieces = squaresWithUserAndOpponentPieces[1];
        //     if (isUserInCheckmate(squaresWithUserPieces, squaresWithOpponentPieces, opponentColor.current, authInfo.color.current)) {
        //         // setCheckMate(true);
        //         console.log("opponent is in checkmate");
        //     } else {
        //         // setCheck(true);
        //         console.log("opponent is in check");
        //     }
        // }
    }, [])

    return (
        <>
            {check && <div>You are in check</div>}
            {checkMate && <div>Checkmate</div>}
            <div className="board-grid-container unclickable">
                {squareTags}
            </div>
            <div onClick={highlightSquares.bind(null, "user")}>Reveal possible squares you can land on {showingUserPiecesPotentialMoves ? <span>✅</span> : null}</div>
            <div onClick={highlightSquares.bind(null, "opponent")}>Reveal possible squares opponent can land on {showingOpponentPiecesPotentialMoves ? <span>✅</span> : null}</div>
            <div onClick={decideToTurnOnOrOffClickedOnPiecePotentialMovesButton}>Reveal possible squares clicked-on piece could land on {showingClickedOnPiecePotentialMoves ? <span>✅</span> : null}</div>
        </>
    )

}

export default Board;

// if (authInfo.color.current === "black") {
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

// function returnIndexOfSquare(square) {
//     const rowPosition = window.getComputedStyle(square).getPropertyValue('grid-row').slice(0, 1); //console.log(rowPosition);
//     const columnPosition = window.getComputedStyle(square).getPropertyValue('grid-column').slice(0, 1);
//     return (8 - rowPosition) * 8 + (columnPosition - 1); 
// }
//const originalSquareIndex = returnIndexOfSquare(clickedOnPiece.current.square); //console.log("originalSquareIndex:", originalSquareIndex);
//const secondarySquareIndex = returnIndexOfSquare(e.currentTarget); console.log("secondarySquareIndex:", secondarySquareIndex);