import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { animateScroll } from 'react-scroll';
import './style.css';

import { withFirebase } from '../firebase';
import { withSession } from '../session';
import { isMobile } from 'react-device-detect';
import SendIcon from '../../assets/send-icon.png';
import { 
    getFormattedDate,
    getFormattedUserString
} from '../../util';

const MESSAGE_COUNT_LIMIT = 50;

const ALLOW_SELECT = {
    cursor: 'text',
    userSelect: 'text',
    msUserSelect: 'text',
    KhtmlUserSelect: 'text',
    MozUserSelect: 'text',
    WebkitUserSelect: 'text'
}

const DISALLOW_SELECT = {
    cursor: 'default',
    userSelect: 'none',
    msUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none'
};

class ChatDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            messageCount: 0,
            lastUserMessageId: null,
            oldestMessage: this.props.firebase.getFirebaseTimestampNow(),
            lastUpdateLoadMore: false,
            allowLoadMore: true,

            input: '',
            inputHeight: '30px',
            sendHover: false
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this._handleKeyDown);

        this._fetchMessages();
        this._scrollToBottom();
    }

    componentDidUpdate() {
        if (this.state.lastUpdateLoadMore) this._scrollToTop();
        else this._scrollToBottom();
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this._handleKeyDown);
        this.listener && this.listener();
        this.listener = null;
    }

    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',

                    width: isMobile ? '97%' : '800px',
                    height: '85%',
                    padding: '10px',
                    paddingBottom: '0px',

                    color: '#36454F',
                    borderRadius: '5px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.07), 0 3px 6px 0 rgba(0, 0, 0, 0.07)'
                }}
            >

                {/* message panel */}
                <div
                    id='message-display'
                    style={{
                        display: 'flex',
                        flexDirection: 'column',

                        height: '100%',
                        overflow: 'scroll',
                        cursor: 'default'
                    }}
                >

                    {/* match info */}
                    <div 
                        style={{ 
                            alignSelf: 'center',
                            marginTop: '5px',
                            marginBottom: '25px',
                            textAlign: 'center'
                        }}
                    >
                        {this.props.users.map(user =>
                            <div
                                key={user.name}
                                style={{
                                    marginBottom: '4px',

                                    fontSize: isMobile ? '11px' : '12px',
                                    color: '#919191',
                                    ...DISALLOW_SELECT
                                }}
                            >
                                {getFormattedUserString(user)}
                            </div>
                        )}
                    </div>
                    
                    {/* load more button */}
                    {(this.state.messageCount >= MESSAGE_COUNT_LIMIT) && this.state.allowLoadMore &&
                        <Button
                            onClick={this._loadPastMessages}
                            variant='outline-secondary'
                            size='sm'
                            style={{
                                alignSelf: 'center',

                                height: '25px',
                                width: '70px',
                                marginTop: '5px',
                                marginBottom: '15px',

                                fontSize: '10px',
                                ...DISALLOW_SELECT
                            }}
                        >
                            Load More
                        </Button> 
                    }

                    {/* message data */}
                    {Boolean(this.state.messages.length) && this.state.messages.map((message, index) => {                                                 
                        const belongsToUser = Boolean(message.uid === this.props.user.uid);
                        const matchesAboveUser = Boolean((index > 0) && (message.name === this.state.messages[index - 1].name));
                        const matchesBelowUser = Boolean((index < (this.state.messageCount - 1)) && (message.name === this.state.messages[index + 1].name));
                        const largeTimeGapAbove = (index > 0) ? Boolean((message.timestamp.seconds - this.state.messages[index - 1].timestamp.seconds) >= 3600) : true;
                        const largeTimeGapBelow = (index < (this.state.messageCount - 1)) ? Boolean((this.state.messages[index + 1].timestamp.seconds - message.timestamp.seconds) >= 3600) : true;
                        const hasLastUserTag = Boolean(belongsToUser && (this.state.lastUserMessageId === message.id))

                        return (
                            <div 
                                key={message.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    flexShrink: 0
                                }}
                            >

                                {/* message time */}
                                {largeTimeGapAbove &&
                                    <div
                                        key={'t-' + message.id}
                                        style={{
                                            marginTop: '10px',
                                            marginBottom: '10px',

                                            fontSize: '11px',
                                            color: '#919191',
                                            ...DISALLOW_SELECT
                                        }}
                                    >
                                        {getFormattedDate(message.timestamp.seconds).toUpperCase()}
                                    </div>
                                }

                                {/* user tag */}
                                {!belongsToUser && (!matchesAboveUser || largeTimeGapAbove) && 
                                    <div
                                        key={'u-' + message.id}
                                        style={{
                                            alignSelf: 'flex-start',

                                            marginLeft: '7px',
                                            marginTop: '5px',
                                            marginBottom: '3px',

                                            fontSize: '11px',
                                            color: '#919191',
                                            ...DISALLOW_SELECT
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
                                        paddingLeft: '11px',
                                        paddingRight: '8px',
                                        marginBottom: (!matchesBelowUser && !largeTimeGapBelow && !hasLastUserTag) ? '8px' : '2px',

                                        wordWrap: 'break-word',
                                        fontSize: '12px',
                                        borderTopRightRadius: (belongsToUser && matchesAboveUser && !largeTimeGapAbove) ? '5px' : '20px',
                                        borderBottomRightRadius: (belongsToUser && matchesBelowUser && !largeTimeGapBelow) ? '5px' : '20px',
                                        borderTopLeftRadius: (!belongsToUser && matchesAboveUser && !largeTimeGapAbove) ? '5px' : '20px',
                                        borderBottomLeftRadius: (!belongsToUser && matchesBelowUser && !largeTimeGapBelow) ? '5px' : '20px',
                                        backgroundColor: belongsToUser ? '#0078FF' : '#e9e9e9',
                                        color: belongsToUser ? 'white' : 'black',
                                        ...ALLOW_SELECT
                                    }}
                                >
                                    {message.content}
                                </div>

                                {/* message status */}
                                {hasLastUserTag &&
                                    <div
                                        key={'s-' + message.timestamp}
                                        style={{
                                            alignSelf: 'flex-end',
                                            marginRight: '7px',
                                            marginBottom: '5px',

                                            fontSize: '10px',
                                            color: '#919191',
                                            ...DISALLOW_SELECT
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
                        flexShrink: 0,
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

                    {/* input field */}
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
                            outline: 'none',
                        }}
                    />

                    {/* submit input button */}
                    <img 
                        onDragStart={this._preventDragHandler}
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

    _scrollToBottom = () => {
        animateScroll.scrollToBottom({
            containerId: 'message-display',
            delay: 0,
            duration: 300
        });
    }

    _scrollToTop = () => {
        animateScroll.scrollToTop({
            containerId: 'message-display',
            delay: 0,
            duration: 5000
        });
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

            // add user 'sent' message
            this.setState({
                input: '',
                inputHeight: '30px', 
                lastUpdateLoadMore: false,
                lastUserMessageId: messageId,
                messageCount: this.state.messageCount + 1,
                messages: this.state.messages.concat({
                    id: messageId,
                    uid: this.props.user.uid,
                    content: this.state.input,
                    name: this.props.user.displayName.split(' ')[0],
                    timestamp: this.props.firebase.getFirebaseTimestampNow(),
                    status: 'Sent'
                })
            });
        }).catch(err => {
            console.log(err)
            this.props.setError('Error: Failed to send message. Please wait and try again.');
        });
    }

    _loadPastMessages = () => {
        const startDate = this.props.firebase.getFirebaseTimestamp(
            this.state.oldestMessage.seconds, 
            this.state.oldestMessage.nanoseconds - 1
        );

        this.props.setFetching(true, () => {
            this.props.firebase.getMessageBlock(
                this.props.current, 
                this.props.matchId,
                MESSAGE_COUNT_LIMIT,
                startDate
            ).then(messages => {
                if (messages.length) {

                    // prepend past messages
                    messages.forEach(message => {
                        this.setState({
                            lastUpdateLoadMore: true,
                            oldestMessage: (message.timestamp.seconds < this.state.oldestMessage.seconds) ? message.timestamp : this.state.oldestMessage,
                            messageCount: this.state.messageCount + 1,
                            messages: [message].concat(this.state.messages)
                        }, () => { this.props.setFetching(false); });
                    });
                }
                else {
                    this.setState({ allowLoadMore: false });
                    this.props.setFetching(false);
                }
            }).catch(err => {
                this.props.setFetching(false);
                this.props.setError('Error: Failed to fetch message data. Please wait and try again.');
            });
        });
    }

    _fetchMessages = () => {
        this.listener = this.props.firebase.getMessages(
            this.props.current, 
            this.props.matchId,
            MESSAGE_COUNT_LIMIT,

            // success callback (add message)
            (type, id, message, bulkStart, end) => {
                if (bulkStart) this.props.setFetching(true);
                else if (end) this.props.setFetching(false);
                if ((type === 'added') || (type === 'modified'))
                    this._addMessage(id, message);
            },

            // no message callback
            () => {
                this.props.setFetching(false);
            },

            // failure callback
            () => {
                this.props.setFetching(false);
                this.props.setError('Error: Failed to fetch message data. Please wait and try again.');
            }
        );
    }

    _addMessage = (id, message) => {

        // add and deliver last message if 'sent'
        if (this.state.lastUserMessageId === id) {
            const index = this.state.messages.findIndex(el => el.id === id);
            const messages = [
                ...this.state.messages.slice(0, index), 
                { ...message, status: 'Delivered' },
                ...this.state.messages.slice(index + 1)
            ];
            this.setState({
                lastUpdateLoadMore: false,
                oldestMessage: (message.timestamp.seconds < this.state.oldestMessage.seconds) ? message.timestamp : this.state.oldestMessage,
                messages: messages,
            });
        }

        // add last user message
        else if (message.uid === this.props.user.uid) {
            this.setState({
                lastUpdateLoadMore: false,
                lastUserMessageId: id,
                oldestMessage: (message.timestamp.seconds < this.state.oldestMessage.seconds) ? message.timestamp : this.state.oldestMessage,
                messageCount: this.state.messageCount + 1,
                messages: this.state.messages.concat({
                    ...message,
                    status: 'Delivered'
                })
            });
        }

        // add generic message 
        else {
            this.setState({
                lastUpdateLoadMore: false,
                oldestMessage: (message.timestamp.seconds < this.state.oldestMessage.seconds) ? message.timestamp : this.state.oldestMessage,
                messageCount: this.state.messageCount + 1,
                messages: this.state.messages.concat(message)
            });
        }
    }

    _preventDragHandler = (e) => {
        e.preventDefault();
    }
}

export default withSession(withFirebase(ChatDisplay));