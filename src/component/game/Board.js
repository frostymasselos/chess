import {pieceMoveObj, directionConverterObj} from '../../helper/boardHelp.js'; //refactor to include both from 1 file
import {useState, useEffect, useRef} from 'react';
import React from 'react';  

function Board({db, authInfo, position}) {

    let userColor = useRef(position === 1 ? "white" : "black");
    let boardArray = useRef([]);
    let [gridItems, setGridItems] = useState([]);
    let initialExecutionGridItemsUseEffect = useRef(true);
    let clickedOnPiece = useRef(false);
    // let [clickedOnPiece, setClickedOnPiece] = useState(false);
    // let [testyTag, setTestyTag] = useState(false);
    
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
                console.log(boardArray.current);
                if (userColor.current = "black") {
                    const duplicate = [...boardArray.current.reverse()];
                    for (const square of duplicate) {
                        square.index = 63 - square.index;
                        if (square.piece) {
                            const newRowPosition = 9 - Number.parseInt(square.piece.rowPosition[0])
                            square.piece.rowPosition = `${newRowPosition}/${newRowPosition + 1}`;
                            const newColumnPosition = 9 - Number.parseInt(square.piece.columnPosition[0])
                            square.piece.columnPosition = `${newColumnPosition}/${newColumnPosition + 1}`;
                        }
                    }
                    boardArray.current = duplicate;
                }
                //RENDER PIECES ON BOARD
                renderPieces();
                //TEST
                // testRenderFunction();
            })
        });
    }, []);

    // //2.RENDER PIECES ON BOARD
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
                    ); //data-name={item.piece.name}
                arrayOfJSXPieces.push(gridItem);
            }
        }
        let arrayOfJSXSquares = [];
        //MAKES SQUARES & NEST PIECES IN SQUARES
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
        // console.log(arrayOfJSXSquares);
        setGridItems(arrayOfJSXSquares);
    }

    //2.5 CODE TO EXECUTE WHEN THINGS"RE RENDERED ON BOARD
    useEffect(() => {
    }, [gridItems])

    //3.ONCLICKHANDLER
    function onClickHandler(e) {
        // console.log("onClick handler executed"); console.log(e.currentTarget); //returns GI
        // if (true) {
        //     // console.log("currentTarget", e.currentTarget);
        //     console.log("target", e.target);
        //     return;
        // }
        // e.stopPropagation();
        console.log("clickedOnPiece:", clickedOnPiece.current); console.log("e.target:", e.target);
        if (checkMate()) {
            //CHECKMATE - NO POSSIBLE MOVE PREVENTS OPPONENT'S (NEXT TURN) POSSIBLE MOVE FROM KILLING KING.
        }
        if (clickedOnPiece.current) { 
            //HAVE PREVIOUSLY CLICKED ON PIECE
            console.log("2nd stage", e.target.id, clickedOnPiece.current.id);
            let originalPiece = window.document.querySelector(`#${clickedOnPiece.current.id}`);
            if (e.target.id === clickedOnPiece.current.id) {
                //SAME PIECE: DESELECT
                const piece = e.target;
                //unhighlight
                piece.classList.remove(`highlighted`);
                //reset state
                clickedOnPiece.current = false;
                console.log("piece deselected"); //console.log("current state:", clickedOnPiece.current);
                return;
            } 
            if (e.target.dataset.color === clickedOnPiece.current.color) {
                //OUR PIECE: INVALID
                //unhighlight orginal piece
                originalPiece.classList.remove(`highlighted`);
                //highlight clicked on piece
                e.target.classList.add(`highlighted`);
                //reset state
                clickedOnPiece.current = {color: e.target.dataset.color, id: e.target.id};
                console.log("invalid - moving on our piece.", "new state:", clickedOnPiece.current);
                return;
            } 
            if (!legalGeography(clickedOnPiece.current.id, clickedOnPiece.current.square, e.currentTarget, originalPiece) || putsKingInCheck(clickedOnPiece.current.id, clickedOnPiece.current.square, e.currentTarget, originalPiece)) {
                //ILLEGAL MOVE OR PUTS KING IN CHECK|CHECKMATE
                console.log("illegal geography or puts king in check");
                e.preventDefault();
                return;
            }
            //EXECUTING USER'S CLICK
            function executeUserClick() {
                console.log("executing", "original piece:", originalPiece);
                if (e.target.dataset.square) {
                    //SECOND SQUARE IS AN EMPTY SQUARE
                    let emptySquare = e.target;
                    emptySquare.append(originalPiece);
                    console.log("secondaryEl is an empty square:", e.target);
                    unhighlightAndResetClickedOnPiece();
                    //check for checkmate?
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
                    //reset state
                    clickedOnPiece.current = false;
                    console.log(clickedOnPiece.current); 
                } 
            }
            executeUserClick();
        } else {
            //HAVEN'T PREVIOUSLY CLICKED PIECE (FRESH)
            console.log("1st stage"); console.log(e.target.dataset.color, e.target.dataset.square, e.target.id, userColor.current);
            if (e.target.dataset.square || e.target.dataset.color !== userColor.current) {
                //1ST TIME CLICK ON EMPTY SQUARE OR OPPONENT PIECE OR OFF-BOARD
                console.log("exited");
                e.preventDefault();
                return;
            }
            //1ST TIME CLICK ON OWN PIECE
            let piece = e.target;
            //REGISTER, IN STATE, INFO ON PIECE CLICKED ON
            clickedOnPiece.current = {color: piece.dataset.color, id: piece.id, square: e.currentTarget};
            console.log(clickedOnPiece.current);
            //HIGHLIGHT SQUARE/PIECE
            // piece.style.setProperty('color', 'pink');
            piece.classList.add(`highlighted`);
        }
    }

    //4. LEGAL-MOVE LOGIC HELPER FUNCTIONS - DONT MOVE ANYTHING IN ARRAY
    function legalGeography(originalPieceId, originalSquare, secondarySquare, originalPiece) {
        //correspond items in board array with squares.
        console.log("originalPieceId:", originalPieceId, "originalSquare:", originalSquare, "secondarySquare:", secondarySquare, pieceMoveObj, directionConverterObj );
        //identify original & secondary square indexes in array.
        function returnBoardArrayIndex(square) {
            const rowPosition = window.getComputedStyle(square).getPropertyValue('grid-row').slice(0, 1); //console.log(rowPosition);
            const columnPosition = window.getComputedStyle(square).getPropertyValue('grid-column').slice(0, 1);
            return (8 - rowPosition) * 8 + (columnPosition - 1); 
        }
        const boardArrayOriginalSquareIndex = returnBoardArrayIndex(originalSquare); console.log(boardArrayOriginalSquareIndex);
        const boardArraySecondarySquareIndex = returnBoardArrayIndex(secondarySquare); console.log(boardArraySecondarySquareIndex);
        //collate potentially valid boardArray indexes.
        const allLegalSecondarySquareIndexes = [];
        const boardArraySquaresWithOpponentPiece = [];
        const boardArraySquaresWithUserPiece = boardArray.current.filter((square) => {
            if (square.piece) {
                let pieceColor = ''; 
                square.piece.white === true ? pieceColor = "white" : pieceColor = "black";
                if (pieceColor === userColor.current) {
                    return true
                } else {
                    boardArraySquaresWithOpponentPiece.push(square);
                }
            
            }
        }); console.log(boardArraySquaresWithOpponentPiece, boardArraySquaresWithUserPiece);
        const pieceType = Object.keys(pieceMoveObj).find((key) => originalPieceId.includes(`${key}`)); console.log(pieceType);
        const total = pieceMoveObj[pieceType].total.primary; console.log(total);
        for (const move of pieceMoveObj[pieceType].direction) { console.log(move);
            for (const direction in directionConverterObj) {
                if (move === direction) {
                    const moveLegalSecondaryIndexes = directionConverterObj[direction].funcPrimary(total, boardArrayOriginalSquareIndex, boardArraySquaresWithUserPiece, boardArraySquaresWithOpponentPiece); //console.log(moveLegalSecondaryIndexes); 
                    moveLegalSecondaryIndexes.forEach((index) => {allLegalSecondarySquareIndexes.push(index);})
                }
            }
        }
        console.log(allLegalSecondarySquareIndexes);
        //is secondarySquare one of these?
        return allLegalSecondarySquareIndexes.some(legalSquareIndex => legalSquareIndex === boardArraySecondarySquareIndex);
    }
    function putsKingInCheck(originalPiece, originalSquare, secondarySquare) {
        //has to imagine original piece has successfully moved to second square (copy array, and reassign secondsquarepiece to originalpiece)
        //cycle through every potential secondary square of opponent (including if it'd put theirs in check?) and if any secondary square is square of our king, illegal move
        return false;
    }

    function checkMate() {
        //HARD: have you checkmate'd opponent? Rules about castling makes it easier to deal with here...
        //has to imagine original piece has successfully moved to second square (copy array, and reassign secondsquarepiece to originalpiece).
        //imagine, if you had another move, could you kill king. If so, find all threatening pieces that can and all the threatening squares they require to kill opponent king. Now, examining all opponent's potential pice moves, assess whether threatening pieces can be killed or all threatening squares be occupied (by opponent piece). If preventable, check. If not, check-mate.
        //EASY: has opponent checkmate'd you?
        //if opponent had another turn, could they kill king? If so...
        return false;
    }

    return (
        <>
            <div className="board-grid-container">
                {gridItems}
            </div>
            {/* <div onClick={onClickHandler}>Click me1</div> */}
            {/* {testRender()} */}
            {/* {testRender} */}
            {/* {testy.current} */}
            {/* {testyTag} */}
        </>
    )

}

export default Board;

    // useEffect(() => {
    // }, []);

    // function testRenderFunction() {
    //     let a = <div onClick={onClickHandler}>Click me2</div>;
    //     setTestRender(a);
    //     // let board = window.document.querySelector('.board-grid-container');//works
    //     // let fresh = React.createElement('section', null, 'fresh');
    //     // let fresh = window.document.createElement('section');
    //     // board.after(fresh);
    // }

    // // let testy = useRef(React.create('section', null, 'fresh'));