import React, { Component } from 'react';

import AuthHomeDisplay from './auth';
import NoAuthHomeDisplay from './noauth';
import LoadingSpinner from './loader';
import { withSession } from '../session';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
                
                {/* loading icon */}
                {(this.props.fetching || !this.props.initFetch) && 
                    <LoadingSpinner />
                }
                    
                {/* auth/noauth displays */}
                {this.props.user ? 
                    <AuthHomeDisplay /> :
                    <NoAuthHomeDisplay />
                }

            </div>
        );
    }
}

export default withSession(HomePage);