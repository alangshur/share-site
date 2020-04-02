import React, { Component } from 'react';
import Slider from 'rc-slider';
import { isMobile } from 'react-device-detect';
import 'rc-slider/assets/index.css';

class SurveyQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.initValue,
            edited: false
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
                        fontStyle: this.state.edited ? 'normal' : 'italic' 
                    }} 
                >
                    <b style={{ fontStyle: 'normal' }}>Q{this.props.num + 1}: </b>
                    {this.props.prompt}
                </div>

                <div 
                    onClick={this._onClick}
                    style={{ width: '100%', cursor: 'pointer' }}
                >
                    <Slider
                        value={this.state.value}
                        onChange={this._onChange}
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
                        style={{ width: '100%' }}
                    />
                </div>
            </div>
        );
    }

    _onClick = () => {
        this.setState({ edited: true });
        this.props.updateEdit(this.props.num, true);
    }

    _onChange = val => {
        this.setState({ value: val });
        this.props.updateVal(this.props.num, val);
    }
}

export default SurveyQuestion;