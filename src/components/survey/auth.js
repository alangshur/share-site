import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import LoadingSpinner from '../../loading';
import SurveyQuestion from './question';
import { withFirebase } from '../firebase';

const QUESTION_COUNT = 15;

class AuthSurveyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: true,

            name: '',
            age: '',
            country: '',
            region: '',

            0: [5, false], 1: [5, false], 2: [5, false], 3: [5, false], 
            4: [5, false], 5: [5, false], 6: [5, false], 7: [5, false], 
            8: [5, false], 9: [5, false], 10: [5, false], 11: [5, false], 
            12: [5, false], 13: [5, false], 14: [5, false]
        }
    }

    componentDidMount() {
        this.setState({ fetching: true }, () => {
            this._fetchSurveyData().then(() => {
                this.setState({ fetching: false });
            }).catch(err => {
                this.setState({ fetching: false });
                this.props.setError('Error: Failed to contact servers.'); 
            });
        });
    }

    render() {

        // return loading icon
        if (this.state.fetching)
            return <LoadingSpinner />;
        
        // return survey
        else return (
            <div
                style={{
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',

                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    paddingTop: '50px',
                    paddingBottom: '50px',

                    color: '#36454F',
                    overflow: 'scroll'
                }}
            >

                {/* title */}
                <b
                    style={{
                        display: 'flex',
                        alignContent: 'center',

                        width: '315px',
                        marginBottom: '100px',
                        
                        fontSize: '18px',
                        textAlign: 'center'
                    }}
                >
                    15 Questions to Find the Most Similar Match in the World
                </b>

                {/* survey questions */}
                <SurveyQuestion
                    num={0}
                    initValue={this.state[0][0]}
                    prompt={'The collective wellbeing of mankind is more important than my own wellbeing.'}
                    zeroPrompt={'No way. My needs come first!'}
                    tenPrompt={'Of course! I serve the people.'}
                    updateVal={this._updateResponseValue}
                    updateEdit={this._updateEditState}
                />

                <SurveyQuestion
                    num={1}
                    initValue={this.state[1][0]}
                    prompt={'I get quickly involved in social circles at new settings.'}
                    zeroPrompt={'Ugh. I hate people.'}
                    tenPrompt={'Yea. I\'m the life of the party.'}
                    updateVal={this._updateResponseValue}
                    updateEdit={this._updateEditState}
                />

                <SurveyQuestion
                    num={2}
                    initValue={this.state[2][0]}
                    prompt={'I\'m happy to be alive.'}
                    zeroPrompt={'Not really. Life is overrated.'}
                    tenPrompt={'Life is positively fantastic.'}
                    updateVal={this._updateResponseValue}
                    updateEdit={this._updateEditState}
                />

                <SurveyQuestion
                    num={3}
                    initValue={this.state[3][0]}
                    prompt={'I often overthink things.'}
                    zeroPrompt={'Never. I just go with the flow.'}
                    tenPrompt={'Yea. My head hurts.'}
                    updateVal={this._updateResponseValue}
                    updateEdit={this._updateEditState}
                />

                <SurveyQuestion
                    num={4}
                    initValue={this.state[4][0]}
                    prompt={'I believe there is some god-like being with a plan.'}
                    zeroPrompt={'Zero chance. That\'s silly.'}
                    tenPrompt={'Not a doubt in my mind.'}
                    updateVal={this._updateResponseValue}
                    updateEdit={this._updateEditState}
                />

                <SurveyQuestion
                    num={5}
                    initValue={this.state[5][0]}
                    prompt={'I often make sacrifices for the greater good.'}
                    zeroPrompt={'No. Not my responsibility.'}
                    tenPrompt={'Yep. Everyone should help out!'}
                    updateVal={this._updateResponseValue}
                    updateEdit={this._updateEditState}
                />

                <SurveyQuestion
                    num={6}
                    initValue={this.state[6][0]}
                    prompt={'I\'m completely comfortable being the center of attention.'}
                    zeroPrompt={'That\'s my least favorite thing.'}
                    tenPrompt={'Of course. I\'m a social leader.'}
                    updateVal={this._updateResponseValue}
                    updateEdit={this._updateEditState}
                />

                <SurveyQuestion
                    num={7}
                    initValue={this.state[7][0]}
                    prompt={'"Survival of the Fittest" is a better orientation than "One for All and All for One".'}
                    zeroPrompt={'No. We\'re here to help each other.'}
                    tenPrompt={'For sure. The world must be competitive.'}
                    updateVal={this._updateResponseValue}
                    updateEdit={this._updateEditState}
                />

                <SurveyQuestion
                    num={8}
                    initValue={this.state[8][0]}
                    prompt={'I\'m generally less anxious than my friends.'}
                    zeroPrompt={'I stress over everything.'}
                    tenPrompt={'100%! I\'m as calm as a cat.'}
                    updateVal={this._updateResponseValue}
                    updateEdit={this._updateEditState}
                />

                <SurveyQuestion
                    num={9}
                    initValue={this.state[9][0]}
                    prompt={'I rarely let gut feeling guide my decisions.'}
                    zeroPrompt={'Not me. I have great instinct.'}
                    tenPrompt={'Trusting your gut is irresponsible.'}
                    updateVal={this._updateResponseValue}
                    updateEdit={this._updateEditState}
                />

                <SurveyQuestion
                    num={10}
                    initValue={this.state[10][0]}
                    prompt={'It\'s my responsibility to share with the less fortunate.'}
                    zeroPrompt={'Says who? That\'s stupid.'}
                    tenPrompt={'No doubt! I\'ll share everything.'}
                    updateVal={this._updateResponseValue}
                    updateEdit={this._updateEditState}
                />

                <SurveyQuestion
                    num={11}
                    initValue={this.state[11][0]}
                    prompt={'I plan on raising (or have raised) my children with religion.'}
                    zeroPrompt={'They can decide for themselves.'}
                    tenPrompt={'Orthodox all the way!'}
                    updateVal={this._updateResponseValue}
                    updateEdit={this._updateEditState}
                />

                <SurveyQuestion
                    num={12}
                    initValue={this.state[12][0]}
                    prompt={'I recharge by being around others.'}
                    zeroPrompt={'Nope. I need to isolate.'}
                    tenPrompt={'My social energy is always high.'}
                    updateVal={this._updateResponseValue}
                    updateEdit={this._updateEditState}
                />

                <SurveyQuestion
                    num={13}
                    initValue={this.state[13][0]}
                    prompt={'People should be self-reliant and not depend on the government.'}
                    zeroPrompt={'No. That\'s a recipe for disaster.'}
                    tenPrompt={'Of course. To each their own!'}
                    updateVal={this._updateResponseValue}
                    updateEdit={this._updateEditState}
                />

                <SurveyQuestion
                    num={14}
                    initValue={this.state[14][0]}
                    prompt={'Worrying about the meaning of life is pointless.'}
                    zeroPrompt={'No. It\'s the mark of a great thinker.'}
                    tenPrompt={'There\'s no reason to worry.'}
                    updateVal={this._updateResponseValue}
                    updateEdit={this._updateEditState}
                />

                {/* name/age form fields */}
                <Form 
                    style={{ 
                        width: '300px',
                        marginBottom: '60px'
                    }}
                >
                    <Form.Group style={{ marginBottom: '20px' }}>
                        <Form.Label style={{ fontSize: '15px' }}>Full Name</Form.Label>
                        <Form.Control 
                            disabled
                            value={this.state.name || ''}
                        />
                    </Form.Group>

                    <Form.Group style={{ marginBottom: '20px' }}>
                        <Form.Label style={{ fontSize: '15px' }}>Age (e.g. 20)</Form.Label>
                        <Form.Control 
                            placeholder='Age'
                            value={this.state.age || ''}
                            onChange={event => this.setState({ age: event.target.value })}
                        />
                    </Form.Group>

                    <Form.Group style={{ marginBottom: '20px' }}>
                        <Form.Label style={{ fontSize: '15px' }}>Country (e.g. United States)</Form.Label>
                        <CountryDropdown
                            value={this.state.country}
                            onChange={country => { this.setState({ country: country }); }}
                            style={{ 
                                width: '300px', 
                                height: '38px',

                                backgroundColor: 'white',
                                color: '#6e757c',
                                textIndent: '4px',
                                borderColor: '#ced4da',
                                outlineWidth: 0
                            }}
                        />
                    </Form.Group>

                    <Form.Group style={{ marginBottom: '20px' }}>
                        <Form.Label style={{ fontSize: '15px' }}>Region (e.g. California)</Form.Label>
                        <RegionDropdown
                            country={this.state.country}
                            value={this.state.region}
                            onChange={region => { this.setState({ region: region }); }}
                            style={{ 
                                width: '300px', 
                                height: '38px',

                                backgroundColor: 'white',
                                color: '#6e757c',
                                textIndent: '4px',
                                borderColor: '#ced4da',
                                outlineWidth: 0
                            }}
                        />
                    </Form.Group>
                </Form>

                {/* submit button */}
                <Button
                    onClick={this._submitSurveyAnswers}
                    size='sm'
                    variant='secondary'
                    style={{
                        width: '210px',
                        marginBottom: '15px'
                    }}
                >
                    Submit
                </Button>

                {/* back button */}
                <Button
                    onClick={() => this.props.history.push('/')}
                    size='sm'
                    variant='secondary'
                    style={{
                        width: '210px'
                    }}
                >
                    Back
                </Button>
            </div>
        );
    }

    _updateResponseValue = (num, val) => {
        this.setState({ [num]: [val, this.state[num][1]] });
    }

    _updateEditState = (num, state) => {
        this.setState({ [num]: [this.state[num][0], state] });
    }

    _fetchSurveyData = () => {
        return this.props.firebase.getUserData().then(user => {
            if (user && user.surveyAnswers) {

                // save existing user data
                this.setState({
                    name: user.name,
                    age: user.age,
                    country: user.country,
                    region: user.region
                });

                // save existing answers
                for (var i = 0; i < QUESTION_COUNT; i++) {
                    this._updateResponseValue(i, Number(user.surveyAnswers[i]));
                }
            }
            else if (!user) this.props.setError('Error: Failed to fetch user data. Please wait and try again.');
            else this.setState({ name: user.name });
        });
    }

    _submitSurveyAnswers = () => {
        this.setState({ fetching: true }, async () => {
            try {
                
                // validate question answers
                var survey = Array(QUESTION_COUNT);
                for (var i = 0; i < QUESTION_COUNT; i++) {
                    if (!this.state[i][1] || (this.state[i][0] < 0) || (this.state[i][0] > 10))
                        throw new Error('Please answers all questions before submitting.');
                    else survey[i] = Number(this.state[i][0]);
                }

                // validate field answers
                if (isNaN(this.state.age) || (Number(this.state.age) < 16) || (Number(this.state.age) > 109))
                    throw new Error('Please enter a valid age in years.');
                if (!this.state.country) throw new Error('Please select a valid country from dropdown.');
                if (!this.state.region) throw new Error('Please select a valid region from dropdown.');

                // record answers
                await this.props.firebase.submitSurveyAnswers(survey, this.state.age, 
                    this.state.country, this.state.region).then(res => {
                    
                    if (res.success) return;
                    else if (!res.success && res.message) throw new Error(res.message);
                    else throw new Error('Failed to communicate with the server. Please wait and try again.');
                });

                // navigate home (success)
                this.setState({ fetching: false }, () => {
                    this.props.history.push('/');
                });
            }
            catch (err) {
                this.setState({ fetching: false });
                this.props.setError('Error: ' + err.message);
            }
        });
    }
}

export default withRouter(withFirebase(AuthSurveyPage));