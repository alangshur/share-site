import React, { Component } from 'react';

import { withFirebase } from '../firebase';
import { withSession } from '../session';
import { isMobile } from 'react-device-detect';

import SendIcon from '../../assets/send-icon.png';

class ChatDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: null,
            messageCount: null,
            input: ''
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
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',

                        height: '100%',
                        overflow: 'scroll'
                    }}
                >
                    {this.state.messages && this.state.messages.map((message, index) => {
                        const belongsToUser = Boolean(message.name === this.props.user.displayName);
                        const matchesAboveUser = Boolean((index > 0) && (message.name === this.state.messages[index - 1].name));
                        const matchesBelowUser = Boolean((index < (this.state.messageCount - 1)) && (message.name === this.state.messages[index + 1].name));

                        return (
                            <div 
                                key={message.timestamp}
                                style={{
                                    alignSelf: belongsToUser ? 'flex-end' : 'flex-start',

                                    maxWidth: '250px',
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
                            width: '78%',
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

                        src={SendIcon}
                        alt='Send Icon'
                        style={{
                            height: '33px',
                            marginLeft: isMobile ? '15px' : '23px',

                            cursor: 'pointer',
                            filter: 'invert(37%) sepia(68%) saturate(5134%) hue-rotate(201deg) brightness(101%) contrast(105%)'
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