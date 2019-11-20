import React, { Component } from 'react';
import { FaBars } from 'react-icons/fa';
import { Navbar, NavbarBrand } from 'reactstrap';

class AppNavbar extends Component {
  render() {
    //const { pathname } = this.props.location;

    return (
      <div>
        <Navbar color="light" light expand="md">
          <FaBars style={styles.hamburger} onClick={this.props.toggleSidebar} />
          <NavbarBrand>
            <img
              style={styles.brandLogo}
              src="/assets/img/bitzerk/BZ_Logo_Full.png"
            />
          </NavbarBrand>
          <NavbarBrand style={styles.bitbooks}>BitBooks</NavbarBrand>
        </Navbar>
      </div>
    );
  }
}

const styles = {
  navbar: {
    marginBottom: 32
  },
  hamburger: {
    cursor: 'pointer',
    fontSize: '1.5rem',
    color: 'rbga(0,0,0,0.3)',
    margin: '0 24px'
  },
  brandLogo: {
    height: 'auto',
    width: '48px',
    border: 1
  },
  bitbooks: {
    fontSize: '24pt',
    // borderLeft: '2px solid gray',
    paddingLeft: '12px'
  }
};

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as AppActions from '../actions/AppActions';
import * as ModalActions from '../actions/ModalActions';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...AppActions, ...ModalActions }, dispatch);
}

AppNavbar = connect(null, mapDispatchToProps)(AppNavbar);

export { AppNavbar };
