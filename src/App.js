import Header from './component/home/Header.js';
import Footer from './component/home/Footer.js';
import Home from './container/Home.js';
import Game from './container/Game.js'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {

    return (
        <Router>
            <>
                <Header />
                <Switch>
                    <Route exact path="/" render={(arg) => <Home />} />
                    <Route path="/:code" render={(url) => <Game params={url.match.url} />} />
                </Switch>
                <Footer />
            </>
        </Router>
    )

}

export default App
// would vanilla JS've captured params?

