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
        this._fetchNextMatching();
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

                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',

                    color: '#36454F'
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
                        height: '170px',

                        borderRadius: '5px',
                        backgroundColor: '#f2f2f2',
                        boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.12), 0 3px 6px 0 rgba(0, 0, 0, 0.12)'
                    }}
                >

                    {/* join button */}
                    <Button
                        onClick={this.props.firebase.doSignIn}
                        size='sm'
                        variant='secondary'
                        style={{
                            width: '210px'
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

                        Time to Join:&nbsp;
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

    _fetchNextMatching = () => {
        this.props.firebase.getNextMatching().then(matching => {
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

    _updateTimeLeft = () => {
        this.timeout = setTimeout(this._updateTimeLeft, 1000);
        const timeLeft = this.state.timeLeft - 1000;
        if (timeLeft > 0) this.setState({ timeLeft: timeLeft });
        else this.setState({ timeLeft: 'Just missed it!' });
    }
}

export default withFirebase(NoAuthHomeDisplay);