import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import { Redirect } from 'react-router';

import AuthMatchPage from './auth';
import LoadingSpinner from '../../loading';
import { withSession } from '../session';
import { getNextMatchingMs } from '../../util';

class MatchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ''
        };

        const timeLeft = getNextMatchingMs();
        this.timeout2 = setTimeout(window.location.reload.bind(window.location), timeLeft);
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
                    cursor: 'default',
                    userSelect: 'none',
                    msUserSelect: 'none',
                    KhtmlUserSelect: 'none',
                    MozUserSelect: 'none',
                    WebkitUserSelect: 'none'
                }}
            >

                {/* alert display */}
                {this.state.error &&
                    <div
                        style={{
                            position: 'fixed',
                            display: 'flex',
                            justifyContent: 'center',
                            zIndex: 10,

                            width: '100%',
                            padding: '20px'
                        }}
                    >
                        <Alert
                            variant='danger'
                            style={{
                                display: 'flex',
                                justifyContent: 'center',

                                width: '100%',
                            }}
                        >
                            {this.state.error}
                        </Alert>
                    </div>
                }

                {/* auth display */}
                {this.props.authLoad ?
                    <>
                        {this.props.user ? 
                            <AuthMatchPage  setError={this._setError} /> :
                            <Redirect to='/' />
                        } 
                    </> :
                    <LoadingSpinner />
                }
            </div>
        );
    }

    _setError = error => {
        this.setState({ error: error }, () => {
            this.timeout = setTimeout(() => {
                this.setState({ error: '' });
            }, 5000);
        });
    }
}

export default withSession(MatchPage);