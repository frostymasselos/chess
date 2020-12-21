import {pieceMoveObj, directionConverterObj} from '../../helper/boardHelp.js'; 
import PawnPromotionOptions from './board/PawnPromotionOptions.js';
import {useState, useEffect, useRef} from 'react';
import React from 'react';  

function Board({db, authInfo, canMove, setCanMove, setUser2SignedIn, triggerBoardUseEffect}) {

    let [check, setCheck] = useState(false);
    let [checkMate, setCheckMate] = useState(false);
    let [squareTags, setSquareTags] = useState([]); //could add it directly to DOM w/vanilla
    let [showingUserPiecesPotentialMoves, setShowingUserPiecesPotentialMoves] = useState(false);
    let [showingOpponentPiecesPotentialMoves, setShowingOpponentPiecesPotentialMoves] = useState(false);
    let [showingClickedOnPiecePotentialMoves, setShowingClickedOnPiecePotentialMoves] = useState(false);
    let [opportunityForPawnToPromote, setOpportunityForPawnToPromote] = useState(false);
    
    let opponent = useRef(authInfo.user === "user1" ? "user2" : "user1");
    let opponentColor = useRef(authInfo.color === "white" ? "black" : "white");
    let boardArray = useRef([]);
    let clickedOnPiece = useRef(false);
    let pawnPromotionGraveyard = useRef([]);
    let nonPawnPromotionGraveyard = useRef([]);
    let pawnPromotionResolveFunction = useRef('');
    let pieceToPromotePawnTo = useRef('');

    function fillBoardArrayWithSquares() {
        boardArray.current = [];
        for (let num = 0; num < 64; num++) { //works
            boardArray.current.push({
                index: num,
                piece: null,
            })
        }
        pawnPromotionGraveyard.current = [];
        nonPawnPromotionGraveyard.current = [];
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
            <div id={`i${index}`} data-square style={styleVal} key={Math.random()}>
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
        // return arrayOfJSXSquares;
        setSquareTags(arrayOfJSXSquares);
    }
    function decideToTurnOnOrOffClickedOnPiecePotentialMovesButton(params) {
        if (showingClickedOnPiecePotentialMoves) {
            setShowingClickedOnPiecePotentialMoves(false);
            if (clickedOnPiece.current) { //if clicked onPiece true, remove its highlighting.
                const allSquareTags = Array.from(window.document.querySelectorAll(`.board-grid-container > div`));
                allSquareTags.forEach((squareTag) => squareTag.classList.remove(`potentialClickedOnPieceSquare`));
            }
        } else {
            setShowingClickedOnPiecePotentialMoves(true);
            if (clickedOnPiece.current) { //if clicked onPiece true, add its highlighting.
                const squaresWithUserAndOpponentPieces = returnSquaresWithUserAndOpponentPieces(); console.log(squaresWithUserAndOpponentPieces);
                const [squaresWithUserPieces, squaresWithOpponentPieces] = [squaresWithUserAndOpponentPieces[0], squaresWithUserAndOpponentPieces[1]]; //console.log("squaresWithUserPieces:", squaresWithUserPieces); console.log("squaresWithOpponentPieces:", squaresWithOpponentPieces)
                const geographicallyLegalSecondarySquareIndicesOfClickedOnPiece = arrayOfGeographicallyLegalSquares(clickedOnPiece.current.id, Number.parseFloat(clickedOnPiece.current.square.id.slice(1)), squaresWithUserPieces, squaresWithOpponentPieces); //console.log("geographicallyLegalSecondarySquareIndices:", geographicallyLegalSecondarySquareIndices);
                simpleHighlightSquares(geographicallyLegalSecondarySquareIndicesOfClickedOnPiece);
            }
        }
    }
    function simpleHighlightSquares(indices) {
        for (const index of indices) {
            let squareToHighlight = window.document.querySelector(`#i${index}`);
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
            setShowingUserPiecesPotentialMoves(false);
            return;
        } 
        
        if (showingOpponentPiecesPotentialMoves && player === "opponent") {
            for (const squareIndex of arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces) {
                const square = window.document.querySelector(`#i${squareIndex}`);
                square.classList.remove(`potentialOpponentSquare`);
            }
            setShowingOpponentPiecesPotentialMoves(false);
            return;
        }
        
        let squareIndices = '';
        if (player === "user") {
            squareIndices = arrayOfGeographicallyLegalSquareIndicesOfAllUserPieces;
            setShowingUserPiecesPotentialMoves(true);
        } else {
            squareIndices = arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces;
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
    function updatePieceToPromotePawnTo(piece) {
        pieceToPromotePawnTo.current = piece;//console.log(piece, pieceToPromotePawnTo.current);
    }
    function resolvePawnPromotion() {
        pawnPromotionResolveFunction.current.call(null, 5);
        setOpportunityForPawnToPromote(false);
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
        const arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces = arrayOfGeographicallyLegalSquaresOfAllUserPieces(squaresWithOpponentPieces, squaresWithUserPieces, enemyColor); //console.log("arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces:", arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces);
        return arrayOfGeographicallyLegalSquareIndicesOfAllOpponentPieces.some((legalSquareIndexOfOpponentPiece) => legalSquareIndexOfOpponentPiece === squareIndexOfUserKing);
    }
    function isUserInCheckmate(squaresWithUserPieces, squaresWithOpponentPieces, ourColor = authInfo.color, enemyColor = opponentColor.current) {
        //for every possible move I make, am I still in check? Make a new board for each move and assess whether I'm still in check
        for (const squareWithUserPiece of squaresWithUserPieces) {
            const originalSquareIndex = squareWithUserPiece.index;
            const geographicallyLegalSquareIndicesOfParticularPiece = arrayOfGeographicallyLegalSquares(squareWithUserPiece.piece.name, originalSquareIndex, squaresWithUserPieces, squaresWithOpponentPieces, ourColor); //console.log("geographicallyLegalSquareIndicesOfParticularPiece", geographicallyLegalSquareIndicesOfParticularPiece);
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
    async function onClickHandler(e) {
        if (clickedOnPiece.current) { 
            console.log("2nd stage");
            const allSquareTags = Array.from(window.document.querySelectorAll(`.board-grid-container > div`));
            const originalPiece = clickedOnPiece.current.piece; //console.log(originalPiece);
            const originalSquareId = clickedOnPiece.current.id; 
            const originalSquareIndex = Number.parseFloat(clickedOnPiece.current.square.id.slice(1)); //console.log(originalSquareIndex);
            const secondarySquareTag = e.currentTarget;
            const secondarySquareIndex = Number.parseFloat(e.currentTarget.id.slice(1)); //console.log(secondarySquareIndex);
            const squaresWithUserAndOpponentPieces = returnSquaresWithUserAndOpponentPieces();
            const [squaresWithUserPieces, squaresWithOpponentPieces] = [squaresWithUserAndOpponentPieces[0], squaresWithUserAndOpponentPieces[1]]; //console.log("squaresWithUserPieces:", squaresWithUserPieces); console.log("squaresWithOpponentPieces:", squaresWithOpponentPieces)
            let boardArrayOriginalPiece = squaresWithUserPieces.find((squareWithUserPiece) => squareWithUserPiece.index === originalSquareIndex).piece; //console.log(boardArrayOriginalPiece);
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
                clickedOnPiece.current = {color: secondaryPiece.dataset.color, id: secondaryPiece.id, square: e.currentTarget, piece: secondaryPiece};
                secondaryPiece.classList.add(`highlighted`);
                if (showingClickedOnPiecePotentialMoves) {
                    allSquareTags.forEach((squareTag) => squareTag.classList.remove(`potentialClickedOnPieceSquare`));
                    const geographicallyLegalSecondarySquareIndicesOfClickedOnPiece = arrayOfGeographicallyLegalSquares(secondaryPiece.id, Number.parseFloat(e.currentTarget.id.slice(1)), squaresWithUserPieces, squaresWithOpponentPieces); //console.log("geographicallyLegalSecondarySquareIndices:", geographicallyLegalSecondarySquareIndices);
                    simpleHighlightSquares(geographicallyLegalSecondarySquareIndicesOfClickedOnPiece);
                }
                console.log("reselected piece"); //"new state:", clickedOnPiece.current);
                return;
            } 
            //check geographically-legal move
            if (!geographicallyLegalSecondarySquareIndices.some(legalSquareIndex => legalSquareIndex === secondarySquareIndex)) {
                console.log("illegal geography");
                e.preventDefault();
                return;
            }
            //check for check. imagine original piece has successfully moved to secondary square.
            const board2 = JSON.parse(JSON.stringify(boardArray.current));
            board2[secondarySquareIndex].piece = board2[originalSquareIndex].piece;
            board2[originalSquareIndex].piece = null;
            if (isUserKingInCheck(board2)) {
                console.log("illegal move - king is in check");
                e.preventDefault();
                return;
            }
            //EXECUTING USER'S CLICK.
            console.log(`executing user's click`);
            originalPiece.classList.remove(`highlighted`);
            clickedOnPiece.current = false;
            setCanMove(false); //boardTag.classList.add(`unclickable`);
            function secondarySquareIndexIsAtEndOfBoard(color, secondarySquareIndex) {
                const endSquaresWhite = [56, 57, 58, 59, 60, 61, 62, 63];
                const endSquaresBlack = [0, 1, 2, 3, 4, 5, 6, 7];
                return color === "white" ? endSquaresWhite.some((index) => index === secondarySquareIndex) : endSquaresBlack.some((index) => index === secondarySquareIndex);
            }
            if (e.target.dataset.square) {
                //second square is an empty square
                let emptySquare = e.target;
                emptySquare.append(originalPiece);
                console.log("secondaryEl is an empty square:", e.target);
                if (secondarySquareIndexIsAtEndOfBoard(authInfo.color, secondarySquareIndex) && originalPiece.id.includes(`pawn`) && pawnPromotionGraveyard.current.length) { //console.log("here");
                    setOpportunityForPawnToPromote(true);
                    await new Promise((resolve) => { console.log("waiting to resolve"); 
                        pawnPromotionResolveFunction.current = resolve;
                    }); 
                    if (pieceToPromotePawnTo.current) { 
                        //change UI
                        emptySquare.firstElementChild.remove();
                        const newTag = window.document.createElement('div'); newTag.className = `${authInfo.color}`; newTag.dataset.color = `${authInfo.color}`;  //add class & data-color
                        newTag.append(`${pieceToPromotePawnTo.current}`);
                        emptySquare.append(newTag);
                        //change dB
                        const userDb = db.ref(`matches/${authInfo.url}/${authInfo.user}`);
                        //kill pawn
                        await userDb.child(`pieces/${boardArrayOriginalPiece.name}`).update({alive: false}); //originalSquareId.slice(5).replace(/\d/, '')
                        //revive
                        await userDb.child(`pieces/${pieceToPromotePawnTo.current}`).update({alive: true,});
                        boardArrayOriginalPiece = {name: pieceToPromotePawnTo.current}; // console.log(pieceToPromotePawnTo.current); console.log(boardArrayOriginalPiece);
                    }
                }
                publishMoveToDb(); console.log("finished onClick handler");
            } else {
                //second square has an enemy piece
                const enemyPiece = e.target;
                const enemyPieceSquare = e.currentTarget;
                enemyPiece.remove();
                // setTimeout(() => {
                //     enemyPiece.classList.add(`fizzle`);
                // }, 2000);
                enemyPieceSquare.append(originalPiece);
                if (secondarySquareIndexIsAtEndOfBoard(authInfo.color, secondarySquareIndex) && originalPiece.id.includes(`pawn`) && pawnPromotionGraveyard.current.length) { //console.log("here");
                    setOpportunityForPawnToPromote(true);
                    await new Promise((resolve) => { console.log("waiting to resolve"); 
                        pawnPromotionResolveFunction.current = resolve;
                    }); 
                    if (pieceToPromotePawnTo.current) { 
                        //change UI
                        enemyPieceSquare.firstElementChild.remove();
                        const newTag = window.document.createElement('div'); newTag.className = `${authInfo.color}`; newTag.dataset.color = `${authInfo.color}`;  //add class & data-color
                        newTag.append(`${pieceToPromotePawnTo.current}`);
                        enemyPieceSquare.append(newTag);
                        //change dB
                        const userDb = db.ref(`matches/${authInfo.url}/${authInfo.user}`);
                        //kill pawn
                        await userDb.child(`pieces/${boardArrayOriginalPiece.name}`).update({alive: false}); //originalSquareId.slice(5).replace(/\d/, '')
                        //revive
                        await userDb.child(`pieces/${pieceToPromotePawnTo.current}`).update({alive: true,});
                        boardArrayOriginalPiece = {name: pieceToPromotePawnTo.current}; // console.log(pieceToPromotePawnTo.current); console.log(boardArrayOriginalPiece);
                    }
                }   
                publishMoveToDb(enemyPiece.id.slice(5)); console.log("finished onClick handler");
            }
            //send this info to db full grid-area property to dB property. 
            async function publishMoveToDb(opponentToKill) {
                //update user piece's coordinates
                let userDb = db.ref(`matches/${authInfo.url}/${authInfo.user}`);
                let opponentDb = db.ref(`matches/${authInfo.url}/${opponent.current}`);
                const updatedRowPosition = window.getComputedStyle(secondarySquareTag).getPropertyValue(`grid-row`).slice(0, 1);
                const updatedColumnPosition = window.getComputedStyle(secondarySquareTag).getPropertyValue('grid-column').slice(0, 1);
                await userDb.child(`pieces/${boardArrayOriginalPiece.name}`).update({
                    rowPosition: `${updatedRowPosition}/${String(Number.parseInt(updatedRowPosition) + 1)}`,
                    columnPosition: `${updatedColumnPosition}/${String(Number.parseInt(updatedColumnPosition) + 1)}`,
                });
                //potentially kill opponent piece
                if (opponentToKill) {
                    await opponentDb.child(`pieces/${opponentToKill}`).update({alive: false});
                }
                //potentially update pawn
                if (boardArrayOriginalPiece.name.includes(`pawn`) && !boardArrayOriginalPiece.moved) { console.log("updating pawn");
                    await userDb.child(`pieces/${boardArrayOriginalPiece.name}`).update({moved: true}); 
                }
                await userDb.update({canMove: false, moved: Math.random()});
            } 
            function checkIfOpponentIsInCheckOrCheckmate() {
                //check if opponent's king's in check/checkmate
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
            }
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
                clickedOnPiece.current = {color: piece.dataset.color, id: piece.id, square: e.currentTarget, piece: e.target}; console.log(clickedOnPiece.current);
                piece.classList.add(`highlighted`);
                //highlight potential squares
                if (showingClickedOnPiecePotentialMoves) { console.log("here2"); //showingClickedOnPiecePotentialMoves
                    const squaresWithUserAndOpponentPieces = returnSquaresWithUserAndOpponentPieces();
                    const [squaresWithUserPieces, squaresWithOpponentPieces] = [squaresWithUserAndOpponentPieces[0], squaresWithUserAndOpponentPieces[1]]; //console.log("squaresWithUserPieces:", squaresWithUserPieces); console.log("squaresWithOpponentPieces:", squaresWithOpponentPieces)
                    const geographicallyLegalSecondarySquareIndices = arrayOfGeographicallyLegalSquares(piece.id, Number.parseFloat(e.currentTarget.id.slice(1)), squaresWithUserPieces, squaresWithOpponentPieces); //console.log("geographicallyLegalSecondarySquareIndices:", geographicallyLegalSecondarySquareIndices);
                    simpleHighlightSquares(geographicallyLegalSecondarySquareIndices);
                }
            }
        }
    }

    //freeze/unfreeze board
    useEffect(() => { 
        const board = window.document.querySelector(`.board-grid-container`); //console.log("board:", board);
        if (canMove) {
            board.classList.remove(`unclickable`);
        } else {
            board.classList.add(`unclickable`);
        }
    }, [canMove]);

    //rotate for black
    useEffect(() => {
        // if (authInfo.color === "black") { console.log("rotating board");
        //     let board = document.querySelector('.board-grid-container');
        //     board.classList.add(`rotate180`);//board.style.setProperty("transform", "rotate(180deg)");
        // } else { console.log("not rotating board");
        // }
    }, []);
    
    //1.populate boardArray & ui
    useEffect(() => {
        fillBoardArrayWithSquares();
        //fill board array with pieces
        let game = db.ref(`matches/${authInfo.url}`);
        game.on('value', function listener(e) {
            game.off('value', listener); //remove listener
            function fillBoardArrayWithPieces(objOfPieces) {
                for (let key in objOfPieces) {
                    //if piece is alive
                    if (!objOfPieces[key].alive) {
                        if (authInfo.color === "white" && objOfPieces[key].white || authInfo.color === "black" && !objOfPieces[key].white ) {
                            const possiblePromotions = ["rook", "knight", "bishop", "queen"];
                            if (possiblePromotions.some((possiblePromotion) => objOfPieces[key].name.includes(possiblePromotion))) {
                                pawnPromotionGraveyard.current.push(objOfPieces[key]);
                            } else {
                                nonPawnPromotionGraveyard.current.push(objOfPieces[key]);
                            }
                        }
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
            fillBoardArrayWithPieces(e.val().user1.pieces);
            fillBoardArrayWithPieces(e.val().user2.pieces);
            console.log("boardArray.current:", boardArray.current);
            renderPieces();
            //check for check & checkamte
            const squaresWithUserAndOpponentPieces = returnSquaresWithUserAndOpponentPieces(boardArray.current); //console.log(squaresWithUserAndOpponentPieces);
            const [squaresWithUserPieces, squaresWithOpponentPieces] = [squaresWithUserAndOpponentPieces[0], squaresWithUserAndOpponentPieces[1]]; //console.log(squaresWithOpponentPieces);
            //are we in check (could opponent kill our king on their next go if none of our pieces moved)?
            if (isUserKingInCheck()) {
                if (isUserInCheckmate(squaresWithUserPieces, squaresWithOpponentPieces)) {
                    endGame();
                    return;
                } else {
                    setCheck(true); return;
                }
            }
            if (isUserInCheckmate(squaresWithUserPieces, squaresWithOpponentPieces)) {
                endGame();
            }
            function endGame(params) {
                setCheckMate(true);
                db.ref(`matches/${authInfo.url}`).update({winner: `${opponentColor.current} (${opponent.current})`});
            }
        });
    }, [triggerBoardUseEffect]);

    //fixes stale closure problem of assigning onClickHandler to onclick attribute via 'mount' useEffect. Now the onClickHandler func the tags have always receives the latest state (& props?)
    useEffect(() => {
        const allSquareTags = Array.from(window.document.querySelectorAll(`.board-grid-container > div`)); //console.log(allSquareTags);
        for (const squareTag of allSquareTags) {
            squareTag.onclick = null;
            squareTag.onclick = onClickHandler;
        }
    });

    //2.execute when square tags're rendered
    useEffect(() => { //console.log("checking for check/checkmate");
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
            {opportunityForPawnToPromote && <PawnPromotionOptions pawnPromotionGraveyard={pawnPromotionGraveyard.current} updatePieceToPromotePawnTo={updatePieceToPromotePawnTo} resolvePawnPromotion={resolvePawnPromotion}/>}
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

// function thereAreDeadPiecesForPawnToPromoteTo() {
//     const possiblePromotions = ["rook", "knight", "bishop", "queen"];
//     return graveyard.current.some((deadPiece) => possiblePromotions.some((possiblePromotion) => deadPiece.name.includes(possiblePromotion)));
// }