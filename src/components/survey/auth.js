import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import LoadingSpinner from '../../loader';
import SurveyQuestion from './question';
import { withFirebase } from '../firebase';

const SURVEY_QUESTIONS = 4;

class AuthSurveyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: true,
            error: '',

            name: '',
            age: '',
            country: '',
            region: '',
            0: -1, 1: -1, 2: -1, 3: -1
        }
    }

    componentDidMount() {
        this.setState({ fetching: true }, () => {
            this._fetchSurveyAnswers().then(() => {
                this.setState({ fetching: false });
            });
        });
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

                            width: '300px',
                            marginBottom: '70px',
                            
                            fontSize: '20px',
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}
                    >
                        Answer Each Question & Submit at Bottom
                    </div>

                    {/* survey questions */}
                    <SurveyQuestion
                        num={0}
                        initValue={(this.state['0'] === -1) ? 0 : this.state['0']}
                        prompt={'Do you plan on raising your chidlren as religious?'}
                        zeroPrompt={'They can decide for themselves.'}
                        tenPrompt={'Orthodox all the way!'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={1}
                        initValue={(this.state['1'] === -1) ? 0 : this.state['1']}
                        prompt={'Do you plan on raising your chidlren as religious?'}
                        zeroPrompt={'They can decide for themselves.'}
                        tenPrompt={'Orthodox all the way!'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={2}
                        initValue={(this.state['2'] === -1) ? 0 : this.state['2']}
                        prompt={'Do you plan on raising your chidlren as religious?'}
                        zeroPrompt={'They can decide for themselves.'}
                        tenPrompt={'Orthodox all the way!'}
                        update={this._updateResponseValue}
                    />

                    <SurveyQuestion
                        num={3}
                        initValue={(this.state['3'] === -1) ? 0 : this.state['3']}
                        prompt={'Do you plan on raising your chidlren as religious?'}
                        zeroPrompt={'They can decide for themselves.'}
                        tenPrompt={'Orthodox all the way!'}
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

                    {/* error text */}
                    {this.state.error &&
                        <div
                            style={{
                                width: '300px',
                                marginBottom: '20px',

                                color: '#dc3545',
                                fontSize: '12px',
                                textAlign: 'center'
                            }}
                        >
                            {this.state.error}
                        </div>
                    }

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
            </div>
        );
    }

    _updateResponseValue = (num, val) => {
        this.setState({ [num]: val });
    }

    _fetchSurveyAnswers = () => {
        return this.props.firebase.getUserData().then(user => {
            if (user && user.surveyAnswers) {
                this.setState({
                    name: user.name,
                    age: user.age,
                    country: user.country,
                    region: user.region
                });

                for (var i = 0; i < SURVEY_QUESTIONS; i++) {
                    this.setState({ [i]: Number(user.surveyAnswers[i]) });
                }
            }
            else if (!user) this.props.history.push('/');
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
                if (isNaN(this.state.age) || (Number(this.state.age) < 12) || (Number(this.state.age) > 110))
                    throw new Error('Please enter a valid age in years.');
                if (!this.state.country) throw new Error('Please select a valid country.');
                if (!this.state.region) throw new Error('Please select a valid region.');

                // record answers
                await this.props.firebase.submitSurveyAnswers(survey, this.state.age, 
                    this.state.country, this.state.region).then(res => {
                    
                    if (res.success) return;
                    else if (!res.success && res.message) throw new Error(res.message);
                    else throw new Error('Error communicating with server. Please wait and try again.');
                });

                this.setState({ fetching: false }, () => {
                    this.props.history.push('/');
                });
            }
            catch (err) {
                this.setState({ 
                    error: err.message,
                    fetching: false 
                });
            }
        });
    }
}

export default withRouter(withFirebase(AuthSurveyPage));