import React, { Component } from 'react';

import { withFirebase } from '../firebase';

class ChatDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: null
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
                    width: '360px',
                    height: '480px',
                    padding: '10px',
                    marginTop: '20px',

                    color: '#36454F',
                    borderRadius: '5px',
                    backgroundColor: 'white',
                    boxShadow: '0 7px 14px 0 rgba(60, 66, 87, 0.12), 0 3px 6px 0 rgba(0, 0, 0, 0.12)'
                }}
            >

                {/* {this.state.messages && this.state.messages.map(message => {
                    return (
                        <div key={message}>
                            {message.content}
                        </div>
                    );
                })} */}
            </div>
        );
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
            if (result) this.setState({ messages: result });
        })
    }
}

export default withFirebase(ChatDisplay);