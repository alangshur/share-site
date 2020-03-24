import React, { Component } from 'react';

import AuthMatchPage from './auth';
import LoadingSpinner from '../../loader';
import { withSession } from '../session';

class MatchPage extends Component {
    render() {
        return (
            <>
                {this.props.user ? 
                    <AuthMatchPage /> :
                    <LoadingSpinner />
                }
            </>
        );
    }
}

export default withSession(MatchPage);