import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

import AuthSurveyPage from './auth';
import LoadingSpinner from '../../loader';
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
                    userSelect: 'none',
                    msUserSelect: 'none',
                    KhtmlUserSelect: 'none',
                    MozUserSelect: 'none'
                }}
            >

                {/* alert display */}
                {this.state.error &&
                    <div
                        style={{
                            position: 'absolute',
                            display: 'flex',
                            justifyContent: 'center',

                            width: '100%',
                            padding: '20px'
                        }}
                    >
                        <Alert
                            variant='danger'
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                zIndex: '10',
                                
                                width: '100%',
                            }}
                        >
                            {this.state.error}
                        </Alert>
                    </div>
                }

                {this.props.user ?
                    <AuthSurveyPage setError={this._setError} /> :
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