import React, { Component } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class SurveyQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.initValue,
            edited: false
        }
    }

    componentDidUpdate() {
        if (this.state.value !== this.props.initValue)
            this.setState({ 
                value: this.props.initValue,
                edited: true
            });
    }

    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',

                    width: '300px',
                    marginBottom: '150px',
                }}
            >
                <div 
                    style={{ 
                        width: '350px', 
                        marginBottom: '25px', 
                        
                        fontStyle: this.state.edited ? '' : 'italic' 
                    }}
                >
                    <b>Question {this.props.num + 1}: </b>
                    {this.props.prompt}
                </div>

                <Slider
                    value={this.state.value}
                    onChange={this._onChange}
                    min={0}
                    max={10}
                    marks={{
                        0: <div style={{ width: '70px', fontSize: '13px', color: 'grey' }}>{this.props.zeroPrompt}</div>,
                        2: '2', 
                        4: '4',
                        6: '6',
                        8: '8', 
                        10: <div style={{ width: '70px', fontSize: '13px', color: 'grey' }}>{this.props.tenPrompt}</div>
                    }}
                    style={{ width: '100%' }}
                />
            </div>
        );
    }

    _onChange = val => {
        this.setState({ edited: true, value: val });
        this.props.update(this.props.num, val);
    }
}

export default SurveyQuestion;