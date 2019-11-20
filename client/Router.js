import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import * as Screens from './screens';
import * as SubScreens from './screens/subscreens';

const { Login, Accounts, Transactions } = Screens;
const { Register } = SubScreens;

import { AppSidebar, AppNavbar } from './components';

import { RequireAuth, ProtectedRoute } from './components/high-order';

class RootRouter extends Component {
  render() {
    const { authenticated } = this.props;
    console.log('authenticated in route? ', authenticated);
    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/login"
            render={props =>
              authenticated ? (
                <Redirect
                  from="/login"
                  to={{ pathname: '/', state: props.location }}
                />
              ) : (
                <Login />
              )
            }
          />
          <AppSidebar>
            <Route
              exact
              path="/"
              render={props => (
                <Redirect
                  from="/"
                  to={{ pathname: '/accounts', state: props.location }}
                />
              )}
            />
            <Route exact path="/accounts" component={RequireAuth(Accounts)} />
            <Route
              exact
              path="/accounts/fees"
              component={RequireAuth(Register)}
            />
            <Route exact path="/records" component={RequireAuth(Register)} />
            <Route
              exact
              path="/accounts/:_id/records"
              component={RequireAuth(Register)}
            />
            <Route
              exact
              path="/transactions"
              component={RequireAuth(Transactions)}
            />
          </AppSidebar>
        </Switch>
      </BrowserRouter>
    );
  }
}

const styles = {
  loader: {
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  container: {
    padding: '6px'
  },
  screenDivHidden: {
    visibility: 'hidden',
    overflow: 'hidden'
  }
};

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as AppActions from './actions/AppActions';

function mapStateToProps(state) {
  const { authenticated } = state.AuthReducer;
  return { authenticated };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AppActions, dispatch);
}

RootRouter = connect(null, mapDispatchToProps)(RootRouter);

export default RootRouter;
