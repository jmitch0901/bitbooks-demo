import React from 'react';
import { Route, Redirect } from 'react-router-dom';

class ProtectedRoute extends React.Component {

    render() {
        const { component: Component, authenticated, ...rest } = this.props;

        return (
            <Route {...rest} render={internalProps => {
                return authenticated ? <Component {...internalProps } /> : <Redirect to={{ pathname: '/login', from: internalProps.location }} />;
            }} />
        );
    }
}

//redux
import { connect } from 'react-redux';

function mapStateToProps(state) {
  const { authenticated } = state.AuthReducer;
  return { authenticated }
}

ProtectedRoute = connect(mapStateToProps)(ProtectedRoute);

export { ProtectedRoute };
