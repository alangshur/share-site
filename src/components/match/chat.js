import React, { Component } from 'react';

import { withFirebase } from '../firebase';
import { withSession } from '../session';
import { isMobile } from 'react-device-detect';
import { getFormattedDate } from '../../util';

import SendIcon from '../../assets/send-icon.png';

class ChatDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: null,
            messageCount: null,
            input: '',
            sendHover: false
        }
    }

    componentDidMount() {
        this._fetchMessages().then(() => {
            this.props.setFetching(false);
        }).catch(err => {
            this.props.setFetching(false);
            this.props.setError('Error: Failed to contact servers.'); 
        });
    }

    render() {
        return (
            <div
                style={{
                    position: 'relative',

                    width: isMobile ? '360px' : '720px',
                    height: isMobile ? '480px' : '70%',
                    padding: '10px',
                    paddingBottom: '0px',
                    marginTop: '20px',

                    color: '#36454F',
                    borderRadius: '5px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.07), 0 3px 6px 0 rgba(0, 0, 0, 0.07)'
                }}
            >

                {/* messages */}
                <div
                    style={{
                        height: '100%',
                        overflow: 'scroll'
                    }}
                >
                    {this.state.messages && this.state.messages.map((message, index) => {
                        const belongsToUser = Boolean(message.name === this.props.user.displayName);
                        const matchesAboveUser = Boolean((index > 0) && (message.name === this.state.messages[index - 1].name));
                        const matchesBelowUser = Boolean((index < (this.state.messageCount - 1)) && (message.name === this.state.messages[index + 1].name));
                        const timeSinceLast = (index > 0) ? message.timestamp.seconds - this.state.messages[index - 1].timestamp.seconds : 3600;

                        return (
                            <div 
                                key={'main' + message.timestamp}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'column'
                                }}
                            >

                                {/* message time */}
                                {(timeSinceLast >= 3600) &&
                                    <div
                                        key={'time' + message.timestamp}
                                        style={{
                                            margin: '10px',
                                            fontSize: '12px',
                                            color: '#919191'
                                        }}
                                    >
                                        {getFormattedDate(message.timestamp.seconds).toUpperCase()}
                                    </div>
                                }


                                {/* user tag */}
                                {!belongsToUser && !matchesAboveUser && 
                                    <div
                                        key={'user' + message.timestamp}
                                        style={{
                                            alignSelf: 'flex-start',

                                            marginLeft: '10px',
                                            marginBottom: '5px',

                                            fontSize: '11px',
                                            color: '#919191'
                                        }} 
                                    >
                                        {message.name}
                                    </div>
                                }

                                {/* message bubble */}
                                <div 
                                    key={'message' + message.timestamp}
                                    style={{
                                        alignSelf: belongsToUser ? 'flex-end' : 'flex-start',

                                        maxWidth: isMobile ? '235px' : '350px',
                                        padding: '5px',
                                        paddingLeft: '10px',
                                        paddingRight: '12px',
                                        marginBottom: '2px',

                                        fontSize: isMobile ? '11px' : '12px',
                                        borderTopRightRadius: (belongsToUser && matchesAboveUser) ? '3px' : '15px',
                                        borderBottomRightRadius: (belongsToUser && matchesBelowUser) ? '3px' : '15px',
                                        borderTopLeftRadius: (!belongsToUser && matchesAboveUser) ? '3px' : '15px',
                                        borderBottomLeftRadius: (!belongsToUser && matchesBelowUser) ? '3px' : '15px',
                                        backgroundColor: belongsToUser ? '#0078FF' : '#e9e9e9',
                                        color: belongsToUser ? 'white' : 'black'
                                    }}
                                >
                                    {message.content}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* message input */}
                <div   
                    style={{
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        zIndex: 5,

                        bottom: 0,
                        left: 0,
                        height: 'auto',
                        width: '100%',
                        paddingTop: '15px',
                        paddingBottom: '15px',

                        backgroundColor: '#f9f9f9'
                    }}
                >
                    <textarea 
                        value={this.state.input}
                        onChange={this._handleInputChange}
                        placeholder='Type a message...'
                        rows={1}
                        style={{
                            height: '36px',
                            width: isMobile ? '78%' : '65%',
                            padding: '10px',
                            paddingLeft: '15px',
                            paddingRight: '15px',

                            lineHeight: '16px',
                            resize: 'none',
                            overflow: 'hidden',
                            borderRadius: '20px',
                            backgroundColor: '#e9e9e9',
                            fontSize: '12px',
                            borderWidth: '0px',
                            outlineWidth: '0px'
                        }}
                    />

                    <img 
                        onMouseEnter={() => { this.setState({ sendHover: true }); }}
                        onMouseLeave={() => { this.setState({ sendHover: false }); }}
                        src={SendIcon}
                        alt='Send Icon'
                        style={{
                            height: '35px',
                            width: '35px',
                            marginLeft: isMobile ? '15px' : '23px',
                            padding: '4px',
                            paddingRight: '0px',

                            borderRadius: '20px',
                            backgroundColor: this.state.sendHover ? '#eeeeee' : '#f9f9f9',
                            cursor: 'pointer',
                        }}
                    />
                </div>
            </div>
        );
    }

    _handleInputChange = event => {
        const field = event.target;
        if (field.value.length > 250) return;
        else this.setState({ input: field.value });

        field.style.height = 'auto';
        field.style.height = field.scrollHeight + 'px';
    }

    _submitMessage = () => {
        return this.props.firebase.writeMessage(
            this.state.current, 
            this.state.matchId,
            'Hello, world!3'
        );
    }

    _fetchMessages = () => {
        return this.props.firebase.getMessages(
            this.props.current, 
            this.props.matchId
        ).then(result => {
            if (result) this.setState({ 
                messages: result.reverse(),
                messageCount: result.length
            });
        });
    }
}

export default withSession(withFirebase(ChatDisplay));