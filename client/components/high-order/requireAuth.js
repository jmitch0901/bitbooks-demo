import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AuthActions from '../../actions/AuthActions';

import Loadable from 'react-loading-overlay';

const RequireAuth = PassedComponent => {
  class ComposedComponent extends Component {
    // Our component just got rendered
    componentDidMount() {
      if (this.props.authenticated) {
        return;
      }
      this.props.getMyInfo(() => {
        if (this.props.authenticated) {
          return;
        }
        this.props.history.replace('/login');
      });
    }

    // Our component just got updated
    componentDidUpdate() {
      if (!this.props.authenticated) {
        this.props.history.replace('/login');
      }
    }

    render() {
      const { authenticated, ...rest } = this.props;
      if (!this.props.authenticated) {
        return (
          <div>
            <Loadable
              style={styles.loader}
              active={true}
              spinner
              spinnerSize="200px"
            />
          </div>
        );
      }
      return <PassedComponent {...rest} />;
    }
  }

  function mapStateToProps(state) {
    const { authenticated } = state.AuthReducer;
    return { authenticated };
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators(AuthActions, dispatch);
  }

  return connect(mapStateToProps, mapDispatchToProps)(ComposedComponent);
};

const styles = {
  loader: {
    position: 'absolute',
    height: '100%',
    width: '100%'
  }
};

export { RequireAuth };
