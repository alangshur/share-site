import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class RulesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userCount: null,
            timeLeft: null
        }
    }

    render() {
        return (
            <div
                style={{
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',

                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',

                    color: '#36454F',
                    userSelect: 'none',
                    msUserSelect: 'none',
                    KhtmlUserSelect: 'none',
                    MozUserSelect: 'none',
                    overflow: 'scroll'
                }}
            >

                {/* center console */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',

                        width: '350px',
                        height: '550px',
                        padding: '25px',

                        borderRadius: '5px',
                        backgroundColor: '#f2f2f2',
                        boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.12), 0 3px 6px 0 rgba(0, 0, 0, 0.12)',
                    }}
                >
                    <div
                        style={{
                            alignSelf: 'center',

                            fontWeight: 'bold',
                            fontSize: '20px'
                        }}
                    >
                        The rules are simple!
                    </div>

                    <div style={{ marginTop: '55px', fontSize: '14px' }}>
                        <b>Step 1: </b>Everyone fills in a survey with a bunch of interesting questions.
                    </div>

                    <div style={{ marginTop: '20px', fontSize: '14px' }}>
                        <b>Step 2: </b>We run an algorithm that places you in a group with the 3-4 most similar people in the world!
                    </div> 

                    <div style={{ marginTop: '20px', fontSize: '14px' }}>
                        <b>Step 3: </b>Chat away.
                    </div> 

                    <div style={{ marginTop: '20px', fontSize: '14px' }}>
                        <b>Step 4: </b>This process will repeat every week. The deadline to join the next matching is Friday at midnight UTC.
                    </div>
                    
                    <div style={{ marginTop: '20px', fontSize: '14px' }}>
                        <b>Remember: </b>Each group chat will only be active until the deadline of the next matching!
                    </div>

                    <Button
                        onClick={() => this.props.history.push('/')}
                        size='sm'
                        variant='secondary'
                        style={{
                            alignSelf: 'center',
                            width: '210px',
                            marginTop: '55px'
                        }}
                    >
                        Back
                    </Button>
                </div>
            </div>
        );
    }
}

export default withRouter(RulesPage);