import React, { Component } from 'react';
import { SidebarContentItem } from './';

import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';

import { UserInfoWidget } from '../widgets';

class SidebarContent extends Component {
  onClick = parentClickListener => {
    parentClickListener && parentClickListener();
  };

  renderListItems = listItems => {
    return listItems.map((item, index) => {
      const { icon, text, link } = item;
      return (
        <ListGroupItem key={index} style={styles.listItem}>
          <Link
            style={styles.noLink}
            onClick={() => this.onClick(item.onClick)}
            to={link || '#'}
          >
            <SidebarContentItem icon={icon} text={text} />
          </Link>
        </ListGroupItem>
      );
    });
  };

  renderBrandSection = () => {
    return (
      <div style={styles.brandSection}>
        <h1>BitBooks</h1>
      </div>
    );
  };

  render() {
    const { listItems } = this.props;
    return (
      <div style={{ width: 250 }}>
        {this.renderBrandSection()}
        <UserInfoWidget />
        <ListGroup style={styles.listGroup}>
          {this.renderListItems(listItems)}
        </ListGroup>
      </div>
    );
  }
}

const styles = {
  listItem: {
    backgroundColor: '#3a3a3c',
    border: 'none',
    padding: 0
  },
  noLink: {
    textDecoration: 'none',
    outline: 'none'
  },
  brandSection: {
    paddingTop: '21px',
    display: 'flex',
    flex: '1',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#dddcdd',
    minHeight: '100px'
  }
};

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as AppActions from '../../actions/AppActions';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AppActions, dispatch);
}

SidebarContent = connect(null, mapDispatchToProps)(SidebarContent);

export { SidebarContent };
