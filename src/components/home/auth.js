import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import { withFirebase } from '../firebase';

class AuthHomeDisplay extends Component {
    render() {
        return (
            <div
                style={{
                    position: 'absolute',

                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%'
                }}
            >
                <Button
                    onClick={this.props.firebase.doSignOut}
                    variant='outline-dark'
                    size='sm'
                    style={{
                        position: 'absolute',

                        top: '15px',
                        right: '15px',
                        width: '170px'
                    }}
                >
                    Sign Out
                </Button>

                <Button
                    onClick={this.props.firebase.doSignOut}
                    variant='outline-dark'
                    size='sm'
                    style={{
                        position: 'absolute',

                        top: '60px',
                        right: '15px',
                        width: '170px'
                    }}
                >
                    How does this work?
                </Button>
            </div>
        );
    }
}

export default withFirebase(AuthHomeDisplay);