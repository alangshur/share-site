import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import { isMobile } from 'react-device-detect';

import LoadingSpinner from '../../loading';
import { withSession } from '../session';
import { withFirebase } from '../firebase';
import HomeIcon from '../../assets/icon.png';
import {
    formatTimeFromMs,
    getNextMatchingDate,
    getCurrentMatchingDate
} from '../../util';

class AuthHomeDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: true,

            signupCount: null,
            timeLeft: null,

            hasCurrentMatch: false,
            hasNextMatch: false,
            algorithmRunning: false
        }
    }

    componentDidMount() {
        this.setState({ fetching: true }, () => {
            this._fetchNextMatching()
                .then(this._fetchUserMatchingData)
                .then(() => { this.setState({ fetching: false }); })
                .catch(err => {
                    this.setState({ fetching: false });
                    this.props.setError('Error: Failed to contact servers.');
                });
        });
    }

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
        this.timeout = null;
    }

    render() {
        return (
            <>

                {/* loading icon */}
                {this.state.fetching &&
                    <LoadingSpinner />
                }

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
                        margin: 0,
                        padding: 0,

                        color: '#36454F',
                        overflow: 'hidden'
                    }}
                >

                    {/* logo */}
                    <img
                        onDragStart={this._preventDragHandler}
                        src={HomeIcon}
                        alt='Home Icon'
                        unselectable={"on"}
                        style={{
                            width: '115px',
                            height: '115px',
                            marginBottom: '15px',

                            opacity: '0.85'
                        }}
                    />

                    {/* title */}
                    <div
                        style={{
                            width: '165px',
                            marginBottom: isMobile ? '50px' : '65px',

                            lineHeight: '22px',
                            letterSpacing: '1px',
                            fontSize: '20px',
                            textAlign: 'center',
                            fontWeight: 600
                        }}
                    >
                        The Global Matching Project
                    </div>

                    {/* matching button */}
                    {this.state.hasCurrentMatch &&
                        <Button
                            disabled={this.state.algorithmRunning}
                            onClick={() => this.props.history.push('/match')}
                            variant='outline-secondary'
                            style={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexShrink: 0,

                                height: '35px',
                                width: '360px',
                                marginBottom: '25px',

                                fontSize: '14px',
                                cursor: this.state.algorithmRunning ? 'default' : 'pointer'
                            }}
                        >

                            {this.state.algorithmRunning ?
                                <>

                                    {/* match compute spinner */}
                                    <Loader
                                        type='Oval'
                                        color='black'
                                        height={23}
                                        width={23}
                                        style={{
                                            position: 'absolute',

                                            top: '4px',
                                            left: '9px',
                                            marginRight: '50px',
                                        }}
                                    />

                                    <div>Computing matches...</div>
                                </> :

                                <>
                                    <div>Go to Your Match</div>

                                    {/* button arrow */}
                                    <div
                                        style={{
                                            position: 'absolute',

                                            top: '2px',
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
                            flexShrink: 0,

                            width: '360px',
                            height: '170px',
                            marginBottom: '25px',

                            color: '#36454F',
                            borderRadius: '5px',
                            backgroundColor: '#f9f9f9',
                            boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.07), 0 3px 6px 0 rgba(0, 0, 0, 0.07)'
                        }}
                    >

                        {/* join button */}
                        <Button
                            disabled={this.state.hasNextMatch}
                            onClick={() => this.props.history.push('/survey')}
                            size='sm'
                            variant='secondary'
                            style={{
                                width: '210px',
                                cursor: this.state.hasNextMatch ? 'default' : 'pointer'
                            }}
                        >
                            {this.state.hasNextMatch ? 'You\'ve joined!' : 'Join Next Matching'}
                        </Button>

                        {/* next matching count */}
                        <div
                            style={{
                                marginTop: '30px',
                                fontSize: '14px'
                            }}
                        >

                            People In Next Matching:&nbsp;
                            <b>
                                {this.state.signupCount ?
                                    this.state.signupCount.toLocaleString() :
                                    '0'
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
                                    '[Loading]'
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
                            flexShrink: 0,

                            width: '360px',
                            height: '150px',

                            color: '#36454F',
                            borderRadius: '5px',
                            backgroundColor: '#f9f9f9',
                            boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.07), 0 3px 6px 0 rgba(0, 0, 0, 0.07)'
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
                                marginTop: '30px'
                            }}
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    _fetchNextMatching = () => {
        return this.props.firebase.getNextMatching().then(matching => {
            if (matching && (this.timeout !== null)) {
                const timeLeft = matching.deadline.toMillis() - Date.now();
                this.timeout = setTimeout(this._updateTimeLeft, 1000);
                this.setState({
                    signupCount: matching.signupCount,
                    timeLeft: timeLeft
                });
            }
            else if (this.timeout !== null) {
                this.props.setError('Error: Failed to fetch data for next matching.');
            }
        });
    }

    _fetchUserMatchingData = () => {
        return this.props.firebase.getUserData().then(user => {
            if (user && (this.timeout !== null)) {
                const next = getNextMatchingDate();
                const current = getCurrentMatchingDate();
                const hasCurrentMatch = user.signups.includes(current);

                this.setState({
                    hasCurrentMatch: hasCurrentMatch,
                    hasNextMatch: user.signups.includes(next),
                    algorithmRunning: hasCurrentMatch && (user.currentMatching !== current)
                });
            }
        });
    }

    _updateTimeLeft = () => {
        this.timeout = setTimeout(this._updateTimeLeft, 1000);
        const timeLeft = this.state.timeLeft - 1000;
        if (timeLeft > 0) this.setState({ timeLeft: timeLeft });
        else this.setState({ timeLeft: 'Just missed it!' });
    }

    _preventDragHandler = (e) => {
        e.preventDefault();
    }
}

export default withRouter(withSession(withFirebase(AuthHomeDisplay)));