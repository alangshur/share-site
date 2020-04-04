import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class RulesPage extends Component {
    render() {
        return (
            <div
                style={{
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',

                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    margin: 0,
                    padding: 0,

                    color: '#36454F',
                    cursor: 'default',
                    userSelect: 'none',
                    msUserSelect: 'none',
                    KhtmlUserSelect: 'none',
                    MozUserSelect: 'none',
                    WebkitUserSelect: 'none',
                    overflow: 'hidden'

                }}
            >

                {/* top console */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        flexShrink: 0,

                        width: '360px',
                        height: '240px',
                        padding: '20px',
                        marginBottom: '25px',

                        fontSize: '13px',
                        borderRadius: '5px',
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.07), 0 3px 6px 0 rgba(0, 0, 0, 0.07)',
                    }}
                >
                    <div
                        style={{
                            alignSelf: 'center',
                            fontSize: '19px',
                        }}
                    >
                        About This Project
                    </div>

                    The whole world, regardless of creed, color, or origin, is struggling right now. Maybe, depsite the thousands of miles between us, we're not too different after all.
                    As a response to this insight, I present the Global Matching Project — an attempt to bring similar people from all over the globe together. I invite you to join: to talk, to bond, to joke, and to expand your horizons.
                </div>

                {/* bottom console */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        flexShrink: 0,

                        width: '360px',
                        height: '380px',
                        padding: '20px',

                        fontSize: '13px',
                        borderRadius: '5px',
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.07), 0 3px 6px 0 rgba(0, 0, 0, 0.07)',
                    }}
                >
                    <div
                        style={{
                            alignSelf: 'center',
                            marginBottom: '3px',
                            fontSize: '19px',
                        }}
                    >
                        How It Works
                    </div>

                    <div>
                        <b>Step 1: </b>Everyone fills in a survey with a bunch of interesting questions.
                    </div>

                    <div>
                        <b>Step 2: </b>We run an algorithm that places you in a group with the four most similar people in the world.
                    </div> 

                    <div>
                        <b>Step 3: </b>Make a friend. Joke around. Fall in love. It's your global playground and your decision.
                    </div> 

                    <div>
                        <b>Step 4: </b>This process will repeat every week. The deadline to join the next matching (and chat with your matches) is Friday at midnight UTC.
                    </div>

                    <Button
                        onClick={() => this.props.history.push('/')}
                        size='sm'
                        variant='secondary'
                        style={{
                            alignSelf: 'center',
                            width: '210px',
                            marginTop: '10px'
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