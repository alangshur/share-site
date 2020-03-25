import React from 'react';

const SessionContext = React.createContext({
    user: null,
    authLoad: false
});

const withSession = Component => props => (
    <SessionContext.Consumer>
        {session => 
            <Component 
                {...props} 
                user={session.user}
                authLoad={session.authLoad}
            />
        }
    </SessionContext.Consumer>
);

export { SessionContext, withSession };