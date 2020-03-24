import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './components/home';
import RulesPage from './components/rules';
import SurveyPage from './components/survey';
import MatchPage from './components/match';
import { SessionContext } from './components/session';
import { withFirebase } from './components/firebase';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            fetching: 1,
            setFetching: this._setFetching
        };
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            user => {
                this.setState({
                    user: user,
                    fetching: !this.state.fetching ? 0 : this.state.fetching - 1,
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
                        <Route path='/match' component={MatchPage} exact />
                        <Route path='/survey' component={SurveyPage} exact />
                        <Route path='/rules' component={RulesPage} exact />
                        <Route path='/' component={HomePage} />
                    </Switch>
                </BrowserRouter>
            </SessionContext.Provider>
        );
    }

    _setFetching = state => {
        if (state) this.setState({ fetching: this.state.fetching + 1 });
        else this.setState({ fetching: !this.state.fetching ? 0 : this.state.fetching - 1 });
    }
}

export default withFirebase(App);
