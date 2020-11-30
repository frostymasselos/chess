import {useEffect} from 'react';

function Board({position}) {

    useEffect(() => {
        if (position === 2) {
            //ROTATE BOARD🐉
            let board = document.querySelector('.board-grid-container'); //works
            board.style.setProperty("transform", "rotate(180deg)");
            console.log("rotating board");
        } else {
            console.log("not rotating board");
        }
    }, []);

    return (
        <>
            <div>Board</div>
            <div className="board-grid-container">
                <div>Test1</div>
            </div>
        </>
    )
}

export default Board