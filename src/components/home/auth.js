import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Loader from 'react-loader-spinner';

import { withFirebase } from '../firebase';
import { formatTimeFromMs } from '../../util';

class AuthHomeDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userCount: null,
            timeLeft: null,
            algorithmRunning: false,
            algorithmMinutesLeft: 0,
        }
    }

    componentDidMount() {
        this._fetchNextMatching();
    }

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
        this.timeout = null;
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

                            <div>Computing matches: </div>
                            <div>&nbsp;{this.state.algorithmMinutesLeft} minutes left...</div>
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

                {/* top console */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',

                        width: '360px',
                        height: '170px',
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
                        height: '130px',

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
                            marginTop: '25px'
                        }}
                    >
                        Sign Out
                    </Button>
                </div>
            </div>
        );
    }

    _fetchNextMatching = () => {
        this.props.firebase.getNextMatching().then(matching => {
            if (matching && (this.timeout !== null)) {
                this.timeout = setTimeout(this._updateTimeLeft, 1000);
                this.setState({
                    userCount: matching.userCount,
                    timeLeft: matching.deadline.toMillis() - Date.now(),
                });
            }
            else if (this.timeout !== null) {
                this.props.setError('Error: Failed to fetch data for next matching.');
            }
        });
    }

    _updateTimeLeft = () => {
        this.timeout = setTimeout(this._updateTimeLeft, 1000);
        this.setState({ timeLeft: this.state.timeLeft - 1000 });
    }
}

export default withRouter(withFirebase(AuthHomeDisplay));