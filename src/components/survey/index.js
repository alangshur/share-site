import React, { Component } from 'react';

import AuthSurveyPage from './auth';
import LoadingSpinner from '../../loader';
import { withSession } from '../session';

class SurveyPage extends Component {
    render() {
        return (
            <>
                {this.props.user ? 
                    <AuthSurveyPage /> :
                    <LoadingSpinner />
                }
            </>
        );
    }
}

export default withSession(SurveyPage);