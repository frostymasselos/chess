import Home from './container/Home.js';
import Game from './container/Game.js'
import HomeErrorPage from './component/home/HomeErrorPage.js';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

function App(params) {
    
    return (
        <Router> 
            <> 
                <Switch>
                    <Route exact path="/" render={(arg) => <Home/>} />
                    <Route exact path="/:code" render={(url) => <Game title={url.match}/>}/> 
                    <Route render={(url) => <HomeErrorPage />}/> 
                </Switch>
            </>
        </Router>
    )
  
}

export default App

