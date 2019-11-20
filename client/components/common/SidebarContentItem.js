import React, { Component } from 'react';

import * as FontAwesome from 'react-icons/fa';

class SidebarContentItem extends Component {
  state = {
    hovered: false
  };

  render() {
    const { icon = '', text } = this.props;

    const RenderedIcon = FontAwesome[icon] ? FontAwesome[icon] : () => <span />;

    // console.log(FontAwesome)

    return (
      <div
        style={Object.assign(
          {},
          styles.container,
          this.state.hovered ? styles.hovered : {}
        )}
        onMouseOver={() => this.setState({ hovered: true })}
        onMouseOut={() => this.setState({ hovered: false })}
      >
        <div style={styles.icon}>
          <RenderedIcon />
        </div>
        <div style={styles.text}>{text}</div>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#dddcdd',
    fontWeight: 600,
    padding: '0.75rem 1.25rem'
  },
  hovered: {
    backgroundColor: '#474747'
  },
  icon: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    minHeight: '100%'
  },
  text: {
    display: 'flex',
    flex: 4,
    alignItems: 'center'
  }
};

export { SidebarContentItem };
