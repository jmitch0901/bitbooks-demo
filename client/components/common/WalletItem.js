import React, { Component } from 'react';

import { ListGroup, ListGroupItem } from 'reactstrap';

class WalletItem extends Component {
  renderWalletDetails = () => {
    const { wallet } = this.props;
    return Object.keys(this.props.wallet).map(key => {
      return (
        <div key={key}>
          {key}: {wallet[key]}
        </div>
      );
    });
  };

  render() {
    const { wallet } = this.props;

    return (
      <ListGroup>
        <ListGroupItem
          style={styles.walletItemStyle}
          tag="button"
          action
          onClick={() => this.props.selectWallet(wallet)}
        >
          <div>{wallet.name}</div>
          <div style={styles.publicKeyText}>{wallet.publicAddress}</div>
          {wallet.balance} {wallet.coinSymbol}
        </ListGroupItem>
      </ListGroup>
    );
  }
}

const styles = {
  walletItemStyle: {
    backgroundColor: 'lightgrey'
  },
  publicKeyText: {
    fontSize: '8pt'
  }
};

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as AccountActions from '../../actions/AccountActions';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch);
}

WalletItem = connect(null, mapDispatchToProps)(WalletItem);

export { WalletItem };
