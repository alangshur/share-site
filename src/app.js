import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './components/home';
import { SessionContext } from './components/session';
import { withFirebase } from './components/firebase';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            fetching: true,
            initFetch: false
        };
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            user => {
                this.setState({
                    user: user,
                    fetching: false,
                    initFetch: true
                });
            }
        );
    }

    componentWillUnmount() {
        this.listener && this.listener();
        this.listener = undefined;
    }

    render() {
        return (
            <SessionContext.Provider value={this.state}>
                <BrowserRouter>
                    <Switch>
                        <Route path='/' component={HomePage} />
                    </Switch>
                </BrowserRouter>
            </SessionContext.Provider>
        );
    }
}

export default withFirebase(App);
