import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Loader from 'react-loader-spinner';

import { withSession } from '../session';
import { withFirebase } from '../firebase';
import { 
    formatTimeFromMs, 
    getNextMatchingDate, 
    getCurrentMatchingDate 
} from '../../util';

class AuthHomeDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userCount: null,
            timeLeft: null,
            hasCurrentMatch: false,
            hasNextMatch: false,
            algorithmRunning: false
        }
    }

    componentDidMount() {
        this.props.setFetching(true);
        this._fetchNextMatching()
            .then(this._fetchUserData)
            .then(() => { this.props.setFetching(false); })
            .catch(err => { 
                this.props.setFetching(false);
                this.props.setError('Error: Failed to contact servers.'); 
            });
    }

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
        this.timeout = null;

        this.timeout2 && clearTimeout(this.timeout2);
        this.timeout2 = null;
    }

    render() {
        return (
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

                    color: '#36454F'
                }}
            >

                {/* matching button */}
                {this.state.hasCurrentMatch &&
                    <Button
                        disabled={this.state.algorithmRunning}
                        variant='outline-dark'
                        style={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',

                            height: '40px',
                            width: '360px',
                            marginBottom: '35px',
                            
                            fontSize: '14px',
                        }}
                    >

                        {this.state.algorithmRunning ?
                            <>

                                {/* match compute spinner */}
                                <Loader
                                    type='Oval'
                                    color='black'
                                    height={25}
                                    width={25}
                                    style={{ 
                                        position: 'absolute',

                                        top: '6px',
                                        left: '9px',
                                        marginRight: '50px' 
                                    }}
                                />

                                <div>Computing matches... Check back soon!</div>
                            </> :

                            <>
                                <div>Go to Current Match</div>

                                {/* button arrow */}
                                <div    
                                    style={{
                                        position: 'absolute',

                                        top: '4px',
                                        right: '12px',
                                        height: '14px',
                                        width: '14px',

                                        fontSize: '18px'
                                    }}
                                >
                                    >
                                </div>
                            </>
                        }

                    </Button>
                }

                {/* top console */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',

                        width: '360px',
                        height: '190px',
                        marginBottom: '35px',

                        color: '#36454F',
                        borderRadius: '5px',
                        backgroundColor: '#f2f2f2',
                        boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.12), 0 3px 6px 0 rgba(0, 0, 0, 0.12)'
                    }}
                >

                    {/* join button */}
                    <Button
                        onClick={() => this.props.history.push('/survey')}
                        size='sm'
                        variant='secondary'
                        style={{
                            width: '210px'
                        }}
                    >
                        Join Next Matching
                    </Button>

                    {/* next matching count */}
                    <div
                        style={{
                            marginTop: '40px',
                            fontSize: '14px'
                        }}
                    >
                        
                        People In Next Matching:&nbsp;
                        <b>
                            {this.state.userCount ?
                                this.state.userCount.toLocaleString() :
                                '--'
                            }
                        </b>
                    </div>

                    {/* time left to next matching */}
                    <div
                        style={{
                            marginTop: '10px',
                            fontSize: '14px'
                        }}
                    >

                        Time to Join:&nbsp;
                        <b>
                            {this.state.timeLeft ?
                                formatTimeFromMs(this.state.timeLeft) :
                                '--'
                            }
                        </b>
                    </div>
                </div>

                {/* bottom console */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',

                        width: '360px',
                        height: '170px',

                        color: '#36454F',
                        borderRadius: '5px',
                        backgroundColor: '#f2f2f2',
                        boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.12), 0 3px 6px 0 rgba(0, 0, 0, 0.12)'
                    }}
                >

                    {/* rules button */}
                    <Button
                        onClick={() => { this.props.history.push('/rules'); }}
                        variant='secondary'
                        size='sm'
                        style={{
                            width: '210px'
                        }}
                    >
                        How does this work?
                    </Button>

                    {/* sign out button */}
                    <Button
                        onClick={this.props.firebase.doSignOut}
                        variant='secondary'
                        size='sm'
                        style={{
                            width: '210px',
                            marginTop: '35px'
                        }}
                    >
                        Sign Out
                    </Button>
                </div>
            </div>
        );
    }

    _fetchNextMatching = () => {
        return this.props.firebase.getNextMatching().then(matching => {
            if (matching && (this.timeout !== null)) {
                const timeLeft = matching.deadline.toMillis() - Date.now();

                this.timeout = setTimeout(this._updateTimeLeft, 1000);
                this.timeout2 = setTimeout(window.location.reload.bind(window.location), timeLeft);
                this.setState({
                    userCount: matching.userCount,
                    timeLeft: timeLeft
                });
            }
            else if (this.timeout !== null) {
                this.props.setError('Error: Failed to fetch data for next matching.');
            }
        });
    }

    _fetchUserMatchingData = () => {
        return this.props.firebase.getUserMatchingData().then(user => {
            if (user && (this.timeout !== null)) {
                const next = getNextMatchingDate();
                const current = getCurrentMatchingDate();
                const hasCurrentMatch = user.signups.includes(current);

                this.setState({
                    hasCurrentMatch: hasCurrentMatch,
                    hasNextMatch: user.signups.includes(next),
                    algorithmRunning: hasCurrentMatch && (user.currentMatch !== current)
                });
            }
            else if (this.timeout !== null) {
                this.props.setError('Error: Failed to fetch user data.');
            }
        }); 
    }

    _updateTimeLeft = () => {
        this.timeout = setTimeout(this._updateTimeLeft, 1000);
        const timeLeft = this.state.timeLeft - 1000;
        if (timeLeft > 0) this.setState({ timeLeft: timeLeft });
        else this.setState({ timeLeft: 'Just missed it!' });
    }
}

export default withRouter(withSession(withFirebase(AuthHomeDisplay)));