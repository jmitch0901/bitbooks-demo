import React, { Component } from 'react';

import { FaUser } from 'react-icons/fa';

class UserInfoWidget extends Component {
  render() {
    const { userInfo } = this.props;
    const { firstName, lastName } = userInfo;
    if (!firstName || !lastName) {
      return null;
    }
    return (
      <div style={styles.container}>
        <div style={styles.userDropdownSection}>
          <FaUser />
          <div style={styles.userName}>
            {firstName} {lastName}
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    color: '#dddcdd',
    fontWeight: 600,
    borderBottom: '1px solid gray'
  },
  userDropdownSection: {
    display: 'flex',
    cursor: 'pointer',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1.25rem'
  },
  userName: {
    fontSize: '12pt',
    paddingLeft: '6px'
  },
  connectNowSection: {
    border: '1px solid gray',
    borderRadius: '6px',
    padding: '12px',
    margin: '6px',
    fontSize: '11pt',
    backgroundColor: '#474747'
  },
  revokeConnect: {
    color: 'salmon'
  },
  connectNowText: {
    padding: '4px 0'
  },
  companySection: {
    fontSize: '10pt',
    textAlign: 'center',
    padding: '12px',
    backgroundColor: '#474747'
  },
  companyDetailsButton: {
    cursor: 'pointer',
    display: 'flex',
    padding: '6px',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    fontSize: '12pt',
    backgroundColor: '#474747'
  }
};

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as TransactionActions from '../../actions/TransactionActions';

function mapStateToProps(state) {
  const { userInfo } = state.AuthReducer;
  return { userInfo };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TransactionActions, dispatch);
}

UserInfoWidget = connect(mapStateToProps, mapDispatchToProps)(UserInfoWidget);

export { UserInfoWidget };
