import React from 'react';

const SessionContext = React.createContext({
    user: null,
    fetching: 1,
    setFetching: () => {}
});

const withSession = Component => props => (
    <SessionContext.Consumer>
        {session => 
            <Component 
                {...props} 
                user={session.user}
                fetching={session.fetching}
                setFetching={session.setFetching}
            />
        }
    </SessionContext.Consumer>
);

export { SessionContext, withSession };