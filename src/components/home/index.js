import React, { Component } from 'react';

import LoadingSpinner from './loader';
import { withSession } from '../session';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                {(this.props.fetching || !this.props.initFetch) && 
                    <LoadingSpinner />
                }

                <div>
                    Home Page
                </div>
            </>
        );
    }
}

export default withSession(HomePage);