import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import { withFirebase } from '../firebase';

class AuthHomeDisplay extends Component {
    render() {
        return (
            <>
                <Button
                    onClick={this.props.firebase.doSignOut}
                    variant='outline-dark'
                    size='sm'
                    style={{
                        position: 'absolute',

                        top: '15px',
                        right: '15px'
                    }}
                >
                    Sign Out
                </Button>
            </>
        );
    }
}

export default withFirebase(AuthHomeDisplay);