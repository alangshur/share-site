import React from 'react';

const SessionContext = React.createContext({});

const withSession = Component => props => (
    <SessionContext.Consumer>
        {session => 
            <Component />
        }
    </SessionContext.Consumer>
);

export { SessionContext, withSession };