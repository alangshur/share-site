import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { isMobile } from 'react-device-detect';

import ChatDisplay from './chat';
import LoadingSpinner from '../../loading';
import { withFirebase } from '../firebase';
import { getCurrentMatchingDate } from '../../util';

class AuthMatchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            initLoad: false,
            matchId: null,
            current: getCurrentMatchingDate(),

            users: null,
            messages: null
        }
    }

    componentDidMount() {
        this.setState({ fetching: true }, () => {

            // get user match info
            this._fetchUserMatchData().then(() => {
                if (this.state.matchId) { 

                    // get match info 
                    this._fetchMatchData().then(() => {
                        this.setState({ fetching: false, initLoad: true });
                    }).catch(err => {
                        this.setState({ fetching: false, initLoad: true });
                        this.props.setError('Error: Failed to contact servers.'); 
                    });
                }
                else this.setState({ fetching: false, initLoad: true });
            }).catch(err => {
                this.setState({ fetching: false, initLoad: true });
                this.props.setError('Error: Failed to contact servers.'); 
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

                {/* match page */}
                <div
                    style={{
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',

                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',

                        overflow: 'hidden'
                    }}
                >

                    {/* back button */}
                    {this.state.initLoad &&
                        <Button
                            onClick={() => this.props.history.push('/')}
                            size='sm'
                            variant='secondary'
                            style={{ width: '210px' }}
                        >
                            Back
                        </Button>
                    }

                    {/* match info */}
                    {this.state.users &&
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',

                                width: isMobile ? '97%' : '720px',
                                height: '115px',
                                padding: '10px',
                                paddingLeft: '15px',
                                paddingRight: '15px',
                                marginTop: '20px',

                                color: '#36454F',
                                borderRadius: '5px',
                                backgroundColor: '#f9f9f9',
                                boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.07), 0 3px 6px 0 rgba(0, 0, 0, 0.07)'
                            }}
                        >
                            {this.state.users.map(user => {
                                return (
                                    <div  
                                        key={user.name}  
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            flexWrap: 'wrap',

                                            fontSize: isMobile ? '12px' : '13px'
                                        }}
                                    >
                                        <div><b>{user.name}</b>, {user.age}</div>
                                        <div>{user.region}, {user.country}</div>
                                    </div>
                                );
                            })}
                        </div>
                    }

                    {/* chat display */}
                    {this.state.matchId && this.state.users &&
                        <ChatDisplay 
                            current={this.state.current}
                            matchId={this.state.matchId}
                            setFetching={this._setFetching}
                            setError={this.props.setError}
                        />
                    }

                </div>
            </>
        );
    }

    _setFetching = (state, callback) => {
        if (callback) this.setState({ fetching: state }, callback);
        else this.setState({ fetching: state });
    }

    _setStateAsync = (state) => {
        return new Promise((resolve) => {
            this.setState(state, resolve);
        });
    }

    _fetchUserMatchData = () => {
        return this.props.firebase.getUserData().then(user => {
            if (user) {
                if ((user.currentMatching === this.state.current) && user.currentMatchId) 
                    return this._setStateAsync({ matchId: user.currentMatchId });
                else this.props.history.push('/');
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

                return this._setStateAsync({ users: userArray });
            }
            else this.props.setError('Error: Failed to fetch match data. Please wait and try again.');
        });
    }
}

export default withRouter(withFirebase(AuthMatchPage));