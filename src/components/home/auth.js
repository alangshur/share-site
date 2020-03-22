import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import { withFirebase } from '../firebase';
import { formatTimeFromMs } from '../../util';

class AuthHomeDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userCount: null,
            timeLeft: null
        }
    }

    componentDidMount() {
        this._fetchCurrentMatching();
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
                    variant='outline-dark'
                    style={{
                        position: 'relative',

                        height: '41px',
                        width: '300px',
                        marginBottom: '35px',
                        
                        fontSize: '14px'
                    }}
                >

                    {/* notification notice */}
                    <div    
                        style={{
                            position: 'absolute',

                            top: '13px',
                            left: '12px',
                            height: '14px',
                            width: '14px',

                            borderRadius: '50%',
                            backgroundColor: '#0066cc'
                        }}
                    />

                    Go To Your Matching

                    {/* button arrow */}
                    <div    
                        style={{
                            position: 'absolute',

                            top: '5px',
                            right: '12px',
                            height: '14px',
                            width: '14px',

                            fontSize: '18px'
                        }}
                    >
                        >
                    </div>
                </Button>

                {/* top console */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',

                        width: '300px',
                        height: '250px',
                        marginBottom: '35px',

                        color: '#36454F',
                        borderRadius: '5px',
                        backgroundColor: '#f2f2f2',
                        boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.12), 0 3px 6px 0 rgba(0, 0, 0, 0.12)'
                    }}
                >

                    {/* join button */}
                    <Button
                        size='sm'
                        variant='outline-dark'
                        style={{
                            width: '200px'
                        }}
                    >
                        Join Next Matching
                    </Button>

                    {/* next matching count */}
                    <div
                        style={{
                            marginTop: '80px',
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

                        width: '300px',
                        height: '150px',

                        color: '#36454F',
                        borderRadius: '5px',
                        backgroundColor: '#f2f2f2',
                        boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.12), 0 3px 6px 0 rgba(0, 0, 0, 0.12)'
                    }}
                >

                    {/* rules button */}
                    <Button
                        variant='outline-dark'
                        size='sm'
                        style={{
                            width: '200px'
                        }}
                    >
                        How does this work?
                    </Button>

                    {/* sign out button */}
                    <Button
                        onClick={this.props.firebase.doSignOut}
                        variant='outline-dark'
                        size='sm'
                        style={{
                            width: '200px',
                            marginTop: '25px'
                        }}
                    >
                        Sign Out
                    </Button>
                </div>
            </div>
        );
    }

    _fetchCurrentMatching = () => {
        this.props.firebase.getMatching().then(matching => {
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

export default withFirebase(AuthHomeDisplay);