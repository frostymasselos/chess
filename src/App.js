import Footer from './element/footer.js';
import Home from './container/Home.js';
import Game from './container/Game.js'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

function App(params) {
    
    return (
        <Router> 
            <> 
                <Switch>
                    <Route exact path="/" render={(arg) => <Home/>} />
                    <Route path="/:code" render={(url) => <Game params={url.match.url}/>}/> 
                </Switch>
                {Footer()}
            </>
        </Router>
    )
  
}

export default App

// would vanilla JS've captured params?

