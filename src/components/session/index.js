import React from 'react';

const SessionContext = React.createContext({
    user: null,
    fetching: true,
    initFetch: false,
    setFetching: () => {}
});

const withSession = Component => props => (
    <SessionContext.Consumer>
        {session => 
            <Component 
                {...props} 
                user={session.user}
                fetching={session.fetching}
                initFetch={session.initFetch}
                setFetching={session.setFetching}
            />
        }
    </SessionContext.Consumer>
);

export { SessionContext, withSession };