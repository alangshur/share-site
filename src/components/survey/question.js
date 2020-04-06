import React, { Component } from 'react';
import Slider from 'rc-slider';
import { isMobile } from 'react-device-detect';
import 'rc-slider/assets/index.css';

class SurveyQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.initValue
        }
    }

    componentDidUpdate() {
        if (this.props.initValue !== this.state.value) {
            this.setState({ value: this.props.initValue });
        }
    }

    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',

                    width: isMobile ? '290px' : '400px',
                    marginBottom: '200px',
                }}
            >
                <div 
                    style={{
                        width: isMobile ? '350px' : '400px', 
                        marginBottom: '25px', 
                        
                        fontSize: isMobile ? '15px' : '16px',
                    }} 
                >
                    <b>Q{this.props.num + 1}: </b>
                    {this.props.prompt}
                    {(this.state.value === -1) && 
                        <div 
                            style={{ 
                                display: 'inline-block',
                                color: '#dc3545',
                                fontWeight: 'bold'
                            }}>
                            *
                        </div>
                    }
                </div>

                <Slider
                    value={this.state.value}
                    onChange={this._onChange}
                    onBeforeChange={this._onChange}
                    min={0}
                    max={10}
                    marks={{
                        0: <div style={{ width: '90px', fontSize: '13px', color: 'grey' }}>{this.props.zeroPrompt}</div>,
                        2: '2', 
                        4: '4',
                        6: '6',
                        8: '8', 
                        10: <div style={{ width: '90px', fontSize: '13px', color: 'grey' }}>{this.props.tenPrompt}</div>
                    }}
                    style={{ 
                        width: '100%',
                        cursor: 'pointer'
                    }}
                />
            </div>
        );
    }

    _onChange = val => {
        this.props.updateVal(this.props.num, val);
    }
}

export default SurveyQuestion;