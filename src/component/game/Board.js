import {useState, useEffect, useRef} from 'react';
import React from 'react';  

function Board({db, authInfo, position}) {

    let userColor = useRef(position === 1 ? "white" : "black");
    let boardArray2 = useRef([]);
    let clickedOnPiece = useRef(false);
    let [gridItems, setGridItems] = useState([]);
    // let [clickedOnPiece, setClickedOnPiece] = useState(false);
    // let [testRender, setTestRender] = useState(false);
    
    function fillBoardArrayWithSquares(params) {
        for (let num = 0; num < 64; num++) { //works
            boardArray2.current.push({
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
        //FILL boardArray2 WITH SQUARES
        fillBoardArrayWithSquares();
        //FILL boardArray2 WITH PIECES
        let game = db.ref(`matches/${authInfo.authCode}`);
        let userDb = db.ref(`matches/${authInfo.authCode}/${authInfo.authUser}`);
        let opponent = '';
        authInfo.authUser === "user1" ? opponent = "user2" : opponent = "user1";
        let opponentDb = db.ref(`matches/${authInfo.authCode}/${opponent}`);
        //FILL boardArray2 WITH OWN PIECES
        userDb.child(`pieces`).on('value', (e) => {
            function fillBoardWithPieces(objOfPieces, dB) {
                dB.child(`pieces`).off(); //remove listener
                // let objOfPieces = e.val();
                for (let key in objOfPieces) {
                    //if piece is alive
                    if (!objOfPieces[key].alive) {
                        continue;
                    }
                    let rowPosition = objOfPieces[key].rowPosition.slice(0, 1); //"1/2"
                    let columnPosition = objOfPieces[key].columnPosition.slice(0, 1); //"6/7"
                    let index = (8 - rowPosition) * 8 + (columnPosition - 1);
                    for (let square of boardArray2.current) {
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
                // setBoardArray(boardArray2.current);
                //RENDER PIECES ON BOARD
                renderPieces();
                //TEST
                // testRenderFunction();
            })
        });
    }, []);

    // //2.RENDER PIECES ON BOARD
    // useEffect(() => {
    //     //PREVENT BELOW CODE FROM EXECUTING ON INITIAL EXECUTION
    //     if (initialExecution) {
    //         initialExecution.current = false;
    //         return;
    //     }

    // }, [boardArray]);

    function renderPieces(params) { //return array of divs
        let arrayOfGridItems = [];
        for (const item of boardArray2.current) {
            // if square has piece 
            if (item.piece) {
                let styleVal = {
                    gridRow: `${item.piece.rowPosition}`,
                    gridColumn:`${item.piece.columnPosition}`,
                    backgroundColor: item.piece.white ? "white" : "red",
                }
                let gridItem = <div onClick={onClickHandler} id={item.piece.name} data-color={item.piece.white ? "white" : "red"} style={styleVal} key={Math.random().toFixed(5)}>{item.piece.name}</div>; //data-name={item.piece.name}
                arrayOfGridItems.push(gridItem);
            }
        }
        console.log(arrayOfGridItems);
        setGridItems(arrayOfGridItems);
        // return arrayOfGridItems;
    }

    function onClickHandler(e) {
        // console.log("onClick handler executed"); console.log(e.currentTarget); //returns GI
        //check if we've already clicked on piece
        console.log("clickedOnPiece:", clickedOnPiece.current);
        if (clickedOnPiece.current) { //clickedOnPiece
            //IS SAME PIECE?
            if (e.currentTarget.id === clickedOnPiece.current.id) {
                clickedOnPiece.current = false;
                console.log("piece deselected", clickedOnPiece.current);
                return;
            }
            console.log("2nd stage");   
            //IS LEGAL MOVE?
            //is square empty?
            //if not, is opponent there? Is opponent king?

            //find GI clicked on & apply CSS on it so that it moves. 
            let clickedOnEl = window.document.querySelector(`#${clickedOnPiece.id}`);
            console.log(e.currentTarget);
            // let newCoordinates = 
            //send this info to db full grid-area property to dB property. 
            //reset state
            console.log(clickedOnEl); 
            // setClickedOnPiece(false);
            return;
        }
        console.log("1st stage");
        //CHECK ITS OUR PIECE
        if (e.currentTarget.dataset.color !== userColor.current) {
            e.preventDefault();
            return
        }
        //REGISTER, IN STATE, INFO ON PIECE CLICKED ON
        // setClickedOnPiece("red");//setClickedOnPiece({color: e.currentTarget.dataset.color, id: e.currentTarget.id});
        clickedOnPiece.current = {color: e.currentTarget.dataset.color, id: e.currentTarget.id};
        console.log(clickedOnPiece.current);
        //HIGHLIGHT SQUARE/PIECE
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