import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import LoadingSpinner from '../../loading';
import { withFirebase } from '../firebase';
import { formatTimeFromMs } from '../../util';

class NoAuthHomeDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: true,

            signupCount: null,
            timeLeft: null
        }
    }

    componentDidMount() {
        this.setState({ fetching: true }, () => {
            this._fetchNextMatching()
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

        this.timeout2 && clearTimeout(this.timeout2);
        this.timeout2 = null;
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

                        color: '#36454F'
                    }}
                >

                    {/* title */}
                    <div
                        style={{
                            marginBottom: '75px',
                            fontSize: '22px'
                        }}
                    >
                        The Global Matching Project
                    </div>

                    {/* center console */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',

                            width: '325px',
                            height: '250px',

                            borderRadius: '5px',
                            backgroundColor: '#f9f9f9',
                            boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.07), 0 3px 6px 0 rgba(0, 0, 0, 0.07)'
                        }}
                    >

                        {/* join button */}
                        <Button
                            onClick={this.props.firebase.doSignIn}
                            variant='secondary'
                            size='sm'
                            style={{
                                width: '210px'
                            }}
                        >
                            Join with Google
                        </Button>

                        {/* rules button */}
                        <Button
                            onClick={() => { this.props.history.push('/rules'); }}
                            variant='secondary'
                            size='sm'
                            style={{
                                width: '210px',
                                marginTop: '20px'
                            }}
                        >
                            How does this work?
                        </Button>

                        {/* next matching count */}
                        <div
                            style={{
                                marginTop: '40px',
                                fontSize: '14px',
                            }}
                        >
                            
                            People In Next Matching:&nbsp;
                            <b>
                                {this.state.signupCount ?
                                    this.state.signupCount.toLocaleString() :
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
            </>
        );
    }

    _fetchNextMatching = () => {
        return this.props.firebase.getNextMatching().then(matching => {
            if (matching && (this.timeout !== null)) {
                const timeLeft = matching.deadline.toMillis() - Date.now();

                this.timeout = setTimeout(this._updateTimeLeft, 1000);
                this.timeout2 = setTimeout(window.location.reload.bind(window.location), timeLeft);
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

    _updateTimeLeft = () => {
        this.timeout = setTimeout(this._updateTimeLeft, 1000);
        const timeLeft = this.state.timeLeft - 1000;
        if (timeLeft > 0) this.setState({ timeLeft: timeLeft });
        else this.setState({ timeLeft: 'Just missed it!' });
    }
}

export default withRouter(withFirebase(NoAuthHomeDisplay));