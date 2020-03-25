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
        }
    }

    componentDidMount() {
        this.setState({ fetching: true }, () => {
            this._fetchUserMatchData().then(result => {
                if (result) this.setState({ matchId: result });
                else { this.props.history.push('/'); return; }

                /* load initial match data and then stop fetching */
                this.setState({ fetching: false });
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

    _fetchUserMatchData = () => {
        return this.props.firebase.getUserData().then(user => {
            if (user) {
                const current = getCurrentMatchingDate();
                if (user.currentMatching === current) return user.currentMatchId;
                else return false;
            }
            else return false;
        });
    }

    _fetchMatchData = () => {
        return this.props.firebase.getMatchData(this.state.matchId).then(match => {
            if (match) {

            }
            else this.props.history.push('/');
        });
    }
}

export default withRouter(withFirebase(AuthMatchPage));