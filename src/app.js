import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './components/home';
import RulesPage from './components/rules';
import SurveyPage from './components/survey';
import { SessionContext } from './components/session';
import { withFirebase } from './components/firebase';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            fetching: true,
            initFetch: false,
            setFetching: this._setFetching
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
        this.listener = null;
    }

    render() {
        return (
            <SessionContext.Provider value={this.state}>
                <BrowserRouter>
                    <Switch>
                        <Route path='/survey' component={SurveyPage} exact />
                        <Route path='/rules' component={RulesPage} exact />
                        <Route path='/' component={HomePage} />
                    </Switch>
                </BrowserRouter>
            </SessionContext.Provider>
        );
    }

    _setFetching = state => {
        this.setState({ fetching: state });
    }
}

export default withFirebase(App);
