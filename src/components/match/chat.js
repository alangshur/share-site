import React, { Component } from 'react';
import './style.css';

import { withFirebase } from '../firebase';
import { withSession } from '../session';
import { isMobile } from 'react-device-detect';
import { getFormattedDate } from '../../util';

import SendIcon from '../../assets/send-icon.png';

class ChatDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            messageCount: 0,
            lastUserMessageId: null,

            input: '',
            inputHeight: '30px',
            sendHover: false
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this._handleKeyDown);
        this._fetchMessages();
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this._handleKeyDown);
    }

    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',

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
                    onLoad={() => { console.log('loaded' )}}
                    style={{
                        height: '100%',
                        overflow: 'scroll'
                    }}
                >
                    {this.state.messages && this.state.messages.map((message, index) => {                                                 
                        const belongsToUser = Boolean(message.name === this.props.user.displayName);
                        const matchesAboveUser = Boolean((index > 0) && (message.name === this.state.messages[index - 1].name));
                        const matchesBelowUser = Boolean((index < (this.state.messageCount - 1)) && (message.name === this.state.messages[index + 1].name));
                        const largeTimeGapAbove = (index > 0) ? Boolean((message.timestamp.seconds - this.state.messages[index - 1].timestamp.seconds) >= 3600) : true;
                        const largeTimeGapBelow = (index < (this.state.messageCount - 1)) ? Boolean((this.state.messages[index + 1].timestamp.seconds - message.timestamp.seconds) >= 3600) : true;

                        return (
                            <div 
                                key={message.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'column'
                                }}
                            >

                                {/* message time */}
                                {largeTimeGapAbove &&
                                    <div
                                        key={'t-' + message.id}
                                        style={{
                                            marginTop: '15px',
                                            marginBottom: '10px',
                                            fontSize: '11px',
                                            color: '#919191'
                                        }}
                                    >
                                        {getFormattedDate(message.timestamp.seconds).toUpperCase()}
                                    </div>
                                }

                                {/* user tag */}
                                {!belongsToUser && !matchesAboveUser && 
                                    <div
                                        key={'u-' + message.id}
                                        style={{
                                            alignSelf: 'flex-start',

                                            marginLeft: '7px',
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
                                    key={'m-' + message.id}
                                    style={{
                                        alignSelf: belongsToUser ? 'flex-end' : 'flex-start',

                                        maxWidth: isMobile ? '235px' : '350px',
                                        padding: '5px',
                                        paddingLeft: '10px',
                                        paddingRight: '12px',
                                        marginBottom: '2px',

                                        wordWrap: 'break-word',
                                        fontSize: isMobile ? '11px' : '12px',
                                        borderTopRightRadius: (belongsToUser && matchesAboveUser && !largeTimeGapAbove) ? '3px' : '15px',
                                        borderBottomRightRadius: (belongsToUser && matchesBelowUser && !largeTimeGapBelow) ? '3px' : '15px',
                                        borderTopLeftRadius: (!belongsToUser && matchesAboveUser && !largeTimeGapAbove) ? '3px' : '15px',
                                        borderBottomLeftRadius: (!belongsToUser && matchesBelowUser && !largeTimeGapBelow) ? '3px' : '15px',
                                        backgroundColor: belongsToUser ? '#0078FF' : '#e9e9e9',
                                        color: belongsToUser ? 'white' : 'black'
                                    }}
                                >
                                    {message.content}
                                </div>

                                {/* message status */}
                                {belongsToUser && (this.state.lastUserMessageId === message.id) &&
                                    <div
                                        key={'status' + message.timestamp}
                                        style={{
                                            alignSelf: 'flex-end',
                                            marginRight: '7px',
                                            marginBottom: '5px',

                                            fontSize: '9px',
                                            color: '#919191'
                                        }} 
                                    >
                                        {message.status}
                                    </div>
                                }
                            </div>
                        );
                    })}
                </div>

                {/* message input */}
                <div   
                    style={{
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
                            height: this.state.inputHeight,
                            width: isMobile ? '78%' : '65%',
                            padding: '7px',
                            paddingLeft: '20px',
                            paddingRight: '20px',

                            lineHeight: '16px',
                            resize: 'none',
                            overflow: 'hidden',
                            borderRadius: '20px',
                            backgroundColor: '#e9e9e9',
                            fontSize: '13px',
                            borderWidth: '0px',
                            outlineWidth: '0px',
                        }}
                    />

                    <img 
                        onClick={this._submitMessage}
                        onMouseEnter={() => { this.setState({ sendHover: true }); }}
                        onMouseLeave={() => { this.setState({ sendHover: false }); }}
                        src={SendIcon}
                        alt='Send Icon'
                        style={{
                            height: '38px',
                            width: '38px',
                            marginBottom: '-4px',
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

    _handleKeyDown = event => {
        if (event.code === 'Enter' || event.key === 'Enter') {
            this._submitMessage();
            event.preventDefault();
        }
    }

    _handleInputChange = event => {
        const field = event.target;
        if (field.value.length > 250) return;
        else this.setState({ 
            input: field.value,
            inputHeight: 'auto'
        }, () => {
            this.setState({ 
                inputHeight: field.scrollHeight + 'px' 
            });
        });
    }

    _submitMessage = () => {
        if ((this.state.input.length <= 0) || (this.state.input.length > 250)) return;

        this.props.firebase.writeMessage(
            this.props.current, 
            this.props.matchId,
            this.state.input
        ).then(messageId => {
            this.setState({
                input: '',
                inputHeight: '30px', 
                lastUserMessageId: messageId,
                messageCount: this.state.messageCount + 1,
                messages: this.state.messages.concat({
                    id: messageId,
                    content: this.state.input,
                    name: this.props.user.displayName,
                    timestamp: this.props.firebase.getFirebaseTimestamp(),
                    status: 'Sent'
                })
            });
        }).catch(err => {
            this.props.setError('Error: Failed to send message. Please wait and try again.');
        });
    }

    _fetchMessages = () => {
        this.props.firebase.getMessages(
            this.props.current, 
            this.props.matchId,
            (id, message) => {
                if (this.state.lastUserMessageId === id) {
                    const index = this.state.messages.findIndex(el => el.id === id);
                    const messages = [
                        ...this.state.messages.slice(0, index), 
                        { ...message, status: 'Delivered' },
                        ...this.state.messages.slice(index + 1)
                    ];

                    this.setState({ messages: messages });
                }
                else if (message.name === this.props.user.displayName) {
                    this.setState({
                        lastUserMessageId: id,
                        messageCount: this.state.messageCount + 1,
                        messages: this.state.messages.concat({
                            ...message,
                            status: 'Delivered'
                        })
                    });
                }
                else {
                    this.setState({
                        messageCount: this.state.messageCount + 1,
                        messages: this.state.messages.concat(message)
                    });
                }
            },
            () => {
                this.props.setError('Error: Failed to fetch message data. Please wait and try again.');
            }
        );
    }
}

export default withSession(withFirebase(ChatDisplay));