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
                    backgroundColor: item.piece.white ? "white" : "red",
                    // height: `inherit`,
                }
                let gridItem = (
                    <div data-piece={item.piece.name} data-color={item.piece.white ? "white" : "red"} style={styleVal} key={Math.random()}>
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
                // height: `40px`,
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
        //doesn't fire on initial execution
        if (initialExecutionGridItemsUseEffect.current) {
            initialExecutionGridItemsUseEffect.current = false;
            return;
        }
        console.log("waited for gridItems state to change", gridItems);
        //set square's CSS height to be explicit value so piece will inherit this value and become same height as square
        let board = document.querySelector('.board-grid-container');

    }, [gridItems])

    //3.ONCLICKHANDLER
    function onClickHandler(e) {
        // console.log("onClick handler executed"); console.log(e.currentTarget); //returns GI
        // if (true) {
        //     // console.log("currentTarget", e.currentTarget);
        //     console.log("target", e.target);
        //     return;
        // }
        //ALREADY CLICKED ON PIECE?
        console.log("clickedOnPiece:", clickedOnPiece.current);
        if (clickedOnPiece.current) { //clickedOnPiece
            //IS SAME PIECE?
            if (e.currentTarget.id === clickedOnPiece.current.id && e.currentTarget.dataset.color === clickedOnPiece.current.color) {
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
        // if (e.currentTarget.dataset.color !== userColor.current) {
        //     e.preventDefault();
        //     return
        // }
        //REGISTER, IN STATE, INFO ON PIECE CLICKED ON
        // setClickedOnPiece("red");//setClickedOnPiece({color: e.currentTarget.dataset.color, id: e.currentTarget.id});
        clickedOnPiece.current = {color: e.currentTarget.dataset.color, id: e.currentTarget.id};
        console.log(clickedOnPiece.current);
        //HIGHLIGHT SQUARE/PIECE
    }

    //4. LEGAL-MOVE LOGIC HELPER FUNCTIONS

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