import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';

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

            0: -1, 1: -1, 2: -1, 3: -1, 4: -1
        }
    }

    componentDidMount() {
        this.setState({ fetching: true}, () => {
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
                for (var i = 0; i < SURVEY_QUESTIONS; i++)
                    this.setState({ [i]: user.surveyAnswers[i] });
            }
        });
    }

    _submitSurveyAnswers = () => {
        this.setState({ fetching: true }, async () => {
            var surveyArray = Array(SURVEY_QUESTIONS);
            for (var i = 0; i < SURVEY_QUESTIONS; i++) {
                if ((this.state[String(i)] < 0) || (this.state[String(i)] > 10)) {
                    this.setState({ error: 'Please answers all questions before submitting.' });
                    return false;
                }
                else surveyArray[i] = this.state[String(i)];
            }

            const result = await this.props.firebase.updateSurveyAnswers(surveyArray).then(res => {
                if (res.success) return true;
                else if (res.message) this.setState({ error: res.message });
                else this.setState({ error: 'Error communicating with server. Please wait and try again.' });
                return false;
            });

            this.setState({ fetching: false }, () => {
                if (result) this.props.history.push('/');
            });
        });
    }
}

export default withRouter(withFirebase(AuthSurveyPage));