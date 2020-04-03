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

                    color: '#36454F',
                    cursor: 'default',
                    userSelect: 'none',
                    msUserSelect: 'none',
                    KhtmlUserSelect: 'none',
                    MozUserSelect: 'none',
                    overflow: 'scroll',
                    WebkitUserSelect: 'none'
                }}
            >

                {/* top console */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',

                        width: '360px',
                        height: '265px',
                        padding: '25px',
                        marginBottom: '20px',

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
                            marginBottom: '25px'
                        }}
                    >
                        About This Project
                    </div>

                    While learning about common struggles from around the world, a simple thought occured to me: maybe we're not too different after all.
                    Maybe people from opposite ends of the world are actually quite similar.
                    From this epiphany, I devised the Global Matching Project — an attempt to bring similar people from all over the globe together. I invite you to join: to talk, to sympathize, to joke, and to expand your horizons.

                </div>

                {/* bottom console */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',

                        width: '360px',
                        height: '435px',
                        padding: '25px',

                        borderRadius: '5px',
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.07), 0 3px 6px 0 rgba(0, 0, 0, 0.07)',
                    }}
                >
                    <div
                        style={{
                            alignSelf: 'center',
                            fontSize: '19px'
                        }}
                    >
                        How It Works
                    </div>

                    <div style={{ marginTop: '25px', fontSize: '13px' }}>
                        <b>Step 1: </b>Everyone fills in a survey with a bunch of interesting questions.
                    </div>

                    <div style={{ marginTop: '15px', fontSize: '13px' }}>
                        <b>Step 2: </b>We run an algorithm that places you in a group with the four most similar people in the world!
                    </div> 

                    <div style={{ marginTop: '15px', fontSize: '13px' }}>
                        <b>Step 3: </b>Make a friend. Joke around. Fall in love. It's your global playground and your decision.
                    </div> 

                    <div style={{ marginTop: '15px', fontSize: '13px' }}>
                        <b>Step 4: </b>This process will repeat every week. The deadline to join the next matching is Friday at midnight UTC.
                    </div>
                     
                    <div style={{ marginTop: '15px', fontSize: '13px' }}>
                        <b>Remember: </b>Each group chat will only be active until the deadline of the next matching!
                    </div>

                    <Button
                        onClick={() => this.props.history.push('/')}
                        size='sm'
                        variant='secondary'
                        style={{
                            alignSelf: 'center',
                            width: '210px',
                            marginTop: '30px'
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