import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import LoadingSpinner from '../../loading';
import SurveyQuestion from './question';
import { withFirebase } from '../firebase';

const SURVEY_QUESTIONS = 4;

class AuthSurveyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: true,

            name: '',
            age: '',
            country: '',
            region: '',
            0: -1, 1: -1, 2: -1, 3: -1
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
        return (
            <>

                {/* loading icon */}
                {this.state.fetching && 
                    <LoadingSpinner />
                }

                {/* survey */}
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
                    <div
                        style={{
                            display: 'flex',
                            alignContent: 'center',

                            width: '315px',
                            marginBottom: '100px',
                            
                            fontSize: '20px',
                            textAlign: 'center'
                        }}
                    >
                        15 Questions to Find the Most Similar Match in the World
                    </div>

                    {/* survey questions */}
                    <SurveyQuestion
                        num={0}
                        initValue={(this.state['0'] === -1) ? 0 : this.state['0']}
                        prompt={'The collective wellbeing of mankind is more important than my own wellbeing.'}
                        zeroPrompt={'No way. My needs come first!'}
                        tenPrompt={'Of course! I serve the people.'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={1}
                        initValue={(this.state['1'] === -1) ? 0 : this.state['1']}
                        prompt={'I get quickly involved in social circles at new jobs.'}
                        zeroPrompt={'Ugh. I hate office parties.'}
                        tenPrompt={'I know all the drama.'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={2}
                        initValue={(this.state['2'] === -1) ? 0 : this.state['2']}
                        prompt={'I\'m happy to be alive.'}
                        zeroPrompt={'Not really. Life is overrated.'}
                        tenPrompt={'Life is positively fantastic.'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={3}
                        initValue={(this.state['3'] === -1) ? 0 : this.state['3']}
                        prompt={'Rationality is more powerful than intuition.'}
                        zeroPrompt={'Incorrect. I never overthink.'}
                        tenPrompt={'Yes. Being logical is a way of life.'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={4}
                        initValue={(this.state['4'] === -1) ? 0 : this.state['4']}
                        prompt={'I believe there is some god-like being with a plan.'}
                        zeroPrompt={'Zero chance. That\'s silly.'}
                        tenPrompt={'Not a doubt in my mind.'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={5}
                        initValue={(this.state['5'] === -1) ? 0 : this.state['5']}
                        prompt={'I often make sacrifices for the greater good.'}
                        zeroPrompt={'No. Not my responsibility.'}
                        tenPrompt={'Yep. Everyone should help out!'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={6}
                        initValue={(this.state['6'] === -1) ? 0 : this.state['6']}
                        prompt={'I\'m completely comfortable being the center of attention.'}
                        zeroPrompt={'That\'s my least favorite thing.'}
                        tenPrompt={'Of course. I\'m a social leader.'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={7}
                        initValue={(this.state['7'] === -1) ? 0 : this.state['7']}
                        prompt={'"Survival of the Fittest" is a better economic model than "One for All and All for One".'}
                        zeroPrompt={'No. We\'re here to help each other.'}
                        tenPrompt={'For sure. The world must be competitive.'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={8}
                        initValue={(this.state['8'] === -1) ? 0 : this.state['8']}
                        prompt={'I\'m generally less anxious than my friends.'}
                        zeroPrompt={'I stress over everything.'}
                        tenPrompt={'100%! I\'m as calm as a cat.'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={9}
                        initValue={(this.state['9'] === -1) ? 0 : this.state['9']}
                        prompt={'I rarely let gut feeling guide my decisions.'}
                        zeroPrompt={'Not me. I have great instinct.'}
                        tenPrompt={'Trusting your gut is irresponsible.'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={10}
                        initValue={(this.state['10'] === -1) ? 0 : this.state['10']}
                        prompt={'It\'s my responsibility to share with the less fortunate.'}
                        zeroPrompt={'Says who? That\'s stupid.'}
                        tenPrompt={'No doubt! I\'ll share everything.'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={11}
                        initValue={(this.state['11'] === -1) ? 0 : this.state['11']}
                        prompt={'I plan on raising (or have raised) my children with religion.'}
                        zeroPrompt={'They can decide for themselves.'}
                        tenPrompt={'Orthodox all the way!'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={12}
                        initValue={(this.state['12'] === -1) ? 0 : this.state['12']}
                        prompt={'I recharge by being around others.'}
                        zeroPrompt={'Nope. I need to isolate.'}
                        tenPrompt={'My social energy is always high.'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={13}
                        initValue={(this.state['13'] === -1) ? 0 : this.state['13']}
                        prompt={'People should be self-reliant and not depend on the government.'}
                        zeroPrompt={'No. That\'s a recipe for disaster.'}
                        tenPrompt={'Yep. To each their own.'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={14}
                        initValue={(this.state['14'] === -1) ? 0 : this.state['14']}
                        prompt={'Worrying about the meaning of life is pointless.'}
                        zeroPrompt={'No. It\'s the mark of a great thinker.'}
                        tenPrompt={'Philosophy is dumb.'}
                        update={this._updateResponseValue}
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
            </>
        );
    }

    _updateResponseValue = (num, val) => {
        this.setState({ [num]: val });
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
                for (var i = 0; i < SURVEY_QUESTIONS; i++) {
                    this.setState({ [i]: Number(user.surveyAnswers[i]) });
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
                var survey = Array(SURVEY_QUESTIONS);
                for (var i = 0; i < SURVEY_QUESTIONS; i++) {
                    if ((this.state[String(i)] < 0) || (this.state[String(i)] > 10))
                        throw new Error('Please answers all questions before submitting.');
                    else survey[i] = Number(this.state[String(i)]);
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