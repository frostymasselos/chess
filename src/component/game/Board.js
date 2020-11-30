import {useState, useEffect, useRef} from 'react';

function Board({db, authInfo, position}) {

    let [boardArray, setBoardArray] = useState([]);
    let boardArray2 = [];
    let [test, setTest] = useState(false);

    let number = useRef(1)
    console.log(number.current);

    function changeTestState(params) {
        setTest(true);
        number.current = 2;
    }

    function makePieces(params) { //return array of divs
        
    }

    function fillBoardWithSquares(params) {
        for (let num = 0; num < 64; num++) { //works
            boardArray2.push({
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
        // let boardArray2 = [];
        fillBoardWithSquares();
        console.log(boardArray2);
        // //FILL BOARD WITH PIECES
        // let game = db.ref(`matches/${authInfo.authCode}`);
        // let user = db.ref(`matches/${authInfo.authCode}/${authInfo.authUser}`);
        // user.child(`pieces`).on('value', (e) => {
        //     user.child(`pieces`).off();
        //     let objOfPieces = e.val(); console.log(objOfPieces);
        //     for (let key in objOfPieces) {
        //         //IF PIECE IS ALIVE?
        //         let rowPosition = objOfPieces[key].rowPosition.slice(0, 1); //"1/2"
        //         let columnPosition = objOfPieces[key].columnPosition.slice(0, 1); //"6/7"
        //         let index = (8 - rowPosition) * 8 + (columnPosition - 1);
        //         for (let square of boardArray2) {
        //             if (index === square.index) { 
        //                 square.piece = objOfPieces[key];
        //                 break;
        //             }
        //         }
        //     }
        //     setBoardArray(boardArray2);
        // });
    }, []);

    return (
        <>
            <div>Board</div>
            <div className="board-grid-container">
            </div>
            <button onClick={changeTestState}>Click button to change state</button>
            {/* {test && <div>I am test</div>} */}
        </>
    )

}

export default Board;