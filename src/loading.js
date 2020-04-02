import React, { Component } from 'react';
import Loader from 'react-loader-spinner';

class LoadingSpinner extends Component {
    render() {
        return (
            <div
                style={{
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10,

                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',

                    cursor: 'default',
                    userSelect: 'none',
                    msUserSelect: 'none',
                    KhtmlUserSelect: 'none',
                    MozUserSelect: 'none',
                    WebkitUserSelect: 'none',
                    overflow: 'hidden',
                    backdropFilter: 'blur(2px)'
                }}
            >
                <Loader
                    type='Oval'
                    color='black'
                    height={150}
                    width={150}
                />
            </div>
        );
    }
}

export default LoadingSpinner;