import {useState, useEffect, useRef} from 'react';

function Board({db, authInfo, position}) {

    let [boardArray, setBoardArray] = useState([]);
    let boardArray2 = useRef([]);

    function makePieces(params) { //return array of divs
    }

    function fillBoardWithSquares(params) {
        for (let num = 0; num < 64; num++) { //works
            boardArray2.current.push({
                index: num,
                piece: null,
            })
        }
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
        // //FILL BOARD WITH PIECES
        let game = db.ref(`matches/${authInfo.authCode}`);
        let userDb = db.ref(`matches/${authInfo.authCode}/${authInfo.authUser}`);
        let opponent = '';
        authInfo.authUser === "user1" ? opponent = "user2" : opponent = "user1";
        let opponentDb = db.ref(`matches/${authInfo.authCode}/${opponent}`);
        userDb.child(`pieces`).on('value', (e) => {
            function fillBoardWithPieces(objOfPieces, dB) {
                dB.child(`pieces`).off(); //remove listener
                // let objOfPieces = e.val();
                for (let key in objOfPieces) {
                    //IF PIECE IS ALIVE?
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
                setBoardArray(boardArray2.current);
            })
        });
    }, []);

    return (
        <>
            <div>Board</div>
            <div className="board-grid-container">
            </div>
        </>
    )

}

export default Board;