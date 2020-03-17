import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import CollectionPage from './components/collection';
import OwnersPage from './components/owners';
import { SessionContext } from './components/session'
 
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <SessionContext.Provider value={this.state.user}>
                <BrowserRouter>
                    <Switch>
                        <Route path='/owners' component={OwnersPage} exact />
                        <Route path='/' component={CollectionPage} />
                    </Switch>
                </BrowserRouter>
            </SessionContext.Provider>
        );
    }
}

export default App;
