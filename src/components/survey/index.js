import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import { Redirect } from 'react-router';

import AuthSurveyPage from './auth';
import LoadingSpinner from '../../loading';
import { withSession } from '../session';

class SurveyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ''
        };
    }

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
        this.timeout = null;
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
                            <AuthSurveyPage setError={this._setError} /> :
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

export default withSession(SurveyPage);