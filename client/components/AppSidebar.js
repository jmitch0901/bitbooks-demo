import React, { Component } from 'react';
import Sidebar from 'react-sidebar';

import { SidebarContent } from './common';

class AppSidebar extends Component {
  listItems = [
    {
      text: 'Books & Summary',
      link: '/accounts',
      icon: 'FaBook'
    },
    {
      text: 'Incoming Transactions',
      link: '/transactions',
      icon: 'FaArrowDown'
    },
    {
      text: 'Logout',
      onClick: () => {
        this.props.logout();
      },
      icon: 'FaSignOutAlt'
    }
  ];

  render() {
    const { isSidebarOpen } = this.props;
    return (
      <Sidebar
        sidebar={<SidebarContent listItems={this.listItems} />}
        open={isSidebarOpen}
        onSetOpen={this.props.toggleSidebar}
        styles={{ sidebar: { background: '#3a3a3c' } }}
        docked={isSidebarOpen}
      >
        <div style={styles.childrenContainer}>{this.props.children}</div>
      </Sidebar>
    );
  }
}

const styles = {
  childrenContainer: {
    padding: '6px'
  }
};

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as AppActions from '../actions/AppActions';
import * as AuthActions from '../actions/AuthActions';

function mapStateToProps(state) {
  const { isSidebarOpen } = state.AppReducer;
  return {
    isSidebarOpen
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...AppActions, ...AuthActions }, dispatch);
}

AppSidebar = connect(mapStateToProps, mapDispatchToProps)(AppSidebar);

export { AppSidebar };
