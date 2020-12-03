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
            //SECONDARY SQUARE ISN'T ORIGINAL SQUARE
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
            //SECONDARY SQUARE ISN'T SQUARE WITH PIECE WITH SAME COLOR
            if (legalGeography(clickedOnPiece.current.id, clickedOnPiece.current.square, e.currentTarget) && kingNotInCheck()) {
                console.log("executing", "original piece:", originalPiece);
                if (e.target.dataset.square) {
                    //secondaryEl IS AN EMPTY SQUARE
                    let emptySquare = e.target;
                    emptySquare.append(originalPiece);
                    console.log("secondaryEl is an empty square:", e.target);
                    unhighlightOriginalPieceResetState();
                    //
                } else {
                    //secondaryEl IS AN ENEMY PIECE
                    const enemyPiece = e.target;
                    const enemyPieceSquare = e.currentTarget;
                    //kill enemy
                    enemyPiece.remove();
                    //append originalPiece
                    enemyPieceSquare.append(originalPiece);
                    // setTimeout(() => {
                    //     enemyPiece.classList.add(`fizzle`);
                    // }, 2000);
                    unhighlightOriginalPieceResetState();
                }
                //send this info to db full grid-area property to dB property. 
                function unhighlightOriginalPieceResetState() {
                    //unhighlight original piece
                    originalPiece.classList.remove(`highlighted`);
                    //reset state
                    clickedOnPiece.current = false;
                    console.log(clickedOnPiece.current); 
                } 
            }
        } else {
            //HAVEN'T PREVIOUSLY CLICKED PIECE (FRESH)
            console.log("1st stage"); console.log(e.target.dataset.color, e.target.dataset.square, e.target.id, userColor.current);
            if (e.target.dataset.square || e.target.dataset.color !== userColor.current) {
                //FRESHLY CLICKED ON EMPTY SQUARE OR OPPONENT PIECE OR OFF-BOARD
                console.log("exited");
                e.preventDefault();
                return;
            }
            //FRESHLY CLICKED ON OWN PIECE
            let piece = e.target;
            //REGISTER, IN STATE, INFO ON PIECE CLICKED ON
            clickedOnPiece.current = {color: piece.dataset.color, id: piece.id, square: e.currentTarget};//🐉refactor `id: piece`.
            console.log(clickedOnPiece.current);
            //HIGHLIGHT SQUARE/PIECE
            // piece.style.setProperty('color', 'pink');
            piece.classList.add(`highlighted`);
        }
    }

    //4. LEGAL-MOVE LOGIC HELPER FUNCTIONS
    function legalGeography(originalPieceId, originalSquare, secondarySquare) {
        //correspond items in board array with squares.
        console.log("originalPieceId:", originalPieceId, "originalSquare:", originalSquare, "secondarySquare:", secondarySquare, pieceMoveObj, directionConverterObj );
        //collate potentially valid boardArray indexes.
        for (const key in pieceMoveObj) {
            if (originalPieceId.includes(`key`)) {
                
            }
        }
        //check that items have pieces where they should (optional).
        return true;
    }
    function kingNotInCheck(originalPiece, originalSquare, secondarySquare) {
        return true;
    }

    function checkMate() {
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