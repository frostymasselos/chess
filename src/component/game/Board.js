import {useState, useEffect, useRef} from 'react';

function Board({db, authInfo, position}) {

    let initialExecution = useRef(true);
    let [boardArray, setBoardArray] = useState([]);

    function makePieces(params) { //return array of divs
        
    }

    function fillBoardWithSquares() {
        let emptyBoard = [];
        for (let num = 0; num < 64; num++) {
            emptyBoard.push({
                index: num,
                piece: null,
            })
        }
        setBoardArray(emptyBoard);
    }

    useEffect(() => {
        if (position === 2) {
            //ROTATE BOARD🐉
            let board = document.querySelector('.board-grid-container'); //works
            // board.style.setProperty("transform", "rotate(180deg)");
            console.log("rotating board");
        } else {
            console.log("not rotating board");
        }
        //FILL BOARD WITH SQUARES
        fillBoardWithSquares();
    }, []);

    useEffect(() => {
        if (initialExecution.current) {
            initialExecution.current = false;
            return;
        }
        //FILL SQUARES WITH (YOUR) PIECES (START)
        let game = db.ref(`matches/${authInfo.authCode}`);
        let user = db.ref(`matches/${authInfo.authCode}/${authInfo.authUser}`);
        user.child(`pieces`).on('value', (e) => {
            user.child(`pieces`).off();
            console.log(boardArray);
            let boardArray2 = boardArray;
            let objOfPieces = e.val(); console.log(objOfPieces);
            for (let key in objOfPieces) {
                //IF PIECE IS ALIVE?
                let rowPosition = objOfPieces[key].rowPosition.slice(0, 1); //"1/2"
                let columnPosition = objOfPieces[key].columnPosition.slice(0, 1); //"6/7"
                let index = (8 - rowPosition) * 8 + (columnPosition - 1);
                for (let square of boardArray2) {
                    if (index === square.index) { 
                        square.piece = objOfPieces[key];
                        break;
                    }
                }
            }
            setBoardArray(boardArray2);
        });
    }, [boardArray]);

    return (
        <>
            <div>Board</div>
            <div className="board-grid-container">
            </div>
        </>
    )

}

export default Board;