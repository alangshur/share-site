import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import LoadingSpinner from '../../loader';
import { withFirebase } from '../firebase';
import { getCurrentMatchingDate } from '../../util';

class AuthMatchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: true,
            matchId: null,
            
            users: null,
            blockCount: null
        }
    }

    componentDidMount() {
        this.setState({ fetching: true }, () => {
            this._fetchUserMatchData().then(() => {
                if (this.state.matchId) { 
                    
                    this._fetchMatchData().then(() => {
                        this.setState({ fetching: false });
                    });
                }
            });
        });
    }

    render() {
        return (
            <>

                {/* loading icon */}
                {this.state.fetching && 
                    <LoadingSpinner />
                }

                {/* match chat */}
                <div
                    style={{
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',

                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                    }}
                >
                    Auth Match Page
                </div>

            </>
        );
    }

    _setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    _fetchUserMatchData = () => {
        return this.props.firebase.getUserData().then(user => {
            if (user) {
                const current = getCurrentMatchingDate();
                if ((user.currentMatching === current) && user.currentMatchId) 
                    return this._setStateAsync({ matchId: user.currentMatchId });
                else this.props.history.push('/');;
            }
            else this.props.setError('Error: Failed to fetch user data. Please wait and try again.');
        });
    }

    _fetchMatchData = () => {
        return this.props.firebase.getMatchData(this.state.matchId).then(match => {
            if (match) {
                var userArray = [];
                for (var id in match.users) {
                    userArray.push({
                        name: match.users[id].name,
                        age: match.users[id].age,
                        region: match.users[id].region,
                        country: match.users[id].country
                    });
                }

                return this._setStateAsync({ 
                    users: userArray,
                    blockCount: match.blockCount
                });
            }
            else this.props.setError('Error: Failed to fetch match data. Please wait and try again.');
        });
    }
}

export default withRouter(withFirebase(AuthMatchPage));