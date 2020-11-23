import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {useEffect} from 'react';
import {useState} from 'react';

function Test(params) {

    let [state, changeState] = useState(20);

    function changey(params) {
        changeState(state += 1);
    }
    function kiwi() {
        console.log("end");
    }
    
    useEffect(() => {
        // kiwi();
        // let pawn1 = document.querySelector('.pawn1');
        // console.log(
            // window.getComputedStyle(pawn1).gridColumn
            // pawn1.style.gridColumn = '1 / 2';
            // pawn1.style.gridRow = '8 / 9';
        // );
        return window.addEventListener("beforeunload", kiwi); 
    }, [])

    let boolean = false;

    return (
        <Router> 
            <>
                {<p>I am p</p>}
                <section className="board-grid-container" onClick={changey}>
                    <div className="pawn1">I am Pawn1</div>
                    {/* <div>I am GI2</div> */}
                    {/* <div>I am GI3</div> */}
                </section>
                <Switch>
                {/* <div>I am a div.</div> */}
                {/* <p>I am a p.</p> */}
                    {/* <Route path="/about" component={About} /> 
                    <Route path="/:kiwi"/> //: denotes params. 
                    <Route path="/about/:pear" render={(grape) => <About title={grape.match}/>}/> //useful format if we want to pass prop. `About` must be NCT. `grape.match` returns an interesting obj🦩
                    <Route component={ErrorPage}/> */}
                </Switch>
            </>
        </Router>
    )
}

export default Test;

