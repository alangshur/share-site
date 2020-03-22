import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import { withFirebase } from '../firebase';
import { formatTimeFromMs } from '../../util';

class NoAuthHomeDisplay extends Component {
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
        this.listener && clearTimeout(this.listener);
        this.listener = null;
    }

    render() {
        return (
            <div
                style={{
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',

                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%'
                }}
            >

                {/* center console */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',

                        width: '325px',
                        height: '200px',

                        color: '#36454F',
                        borderRadius: '5px',
                        backgroundColor: '#f2f2f2',
                        boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.12), 0 3px 6px 0 rgba(0, 0, 0, 0.12)'
                    }}
                >

                    {/* join button */}
                    <Button
                        onClick={this.props.firebase.doSignIn}
                        size='sm'
                        variant='outline-dark'
                        style={{
                            width: '175px'
                        }}
                    >
                        Join with Google
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

                        Time Left to Join:&nbsp;
                        <b>
                            {this.state.timeLeft ?
                                formatTimeFromMs(this.state.timeLeft) :
                                '--'
                            }
                        </b>
                    </div>
                </div>
            </div>
        );
    }

    _fetchCurrentMatching = () => {
        this.props.firebase.getMatching().then(matching => {
            if (matching && this.listener) {
                this.listener = setTimeout(this._updateTimeLeft, 1000);
                this.setState({
                    userCount: matching.userCount,
                    timeLeft: matching.deadline.toMillis() - Date.now(),
                });
            }
        });
    }

    _updateTimeLeft = () => {
        this.listener = setTimeout(this._updateTimeLeft, 1000);
        this.setState({ timeLeft: this.state.timeLeft - 1000 });
    }
}

export default withFirebase(NoAuthHomeDisplay);