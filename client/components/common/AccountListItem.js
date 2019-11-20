import React, { Component } from 'react';

import { ListGroupItem, ListGroupItemHeading, Badge } from 'reactstrap';

class AccountListItem extends Component {
  render() {
    const { account, walletCount, accountBalance } = this.props;

    return (
      <ListGroupItem>
        <div style={styles.container}>
          <ListGroupItemHeading>{account.name}</ListGroupItemHeading>
          <Badge color="secondary" pill onClick={this.props.onClick}>
            {walletCount} wallets
          </Badge>
        </div>
        <div style={styles.container}>
          <div>
            {accountBalance} {account.coinSymbol}
          </div>
        </div>
      </ListGroupItem>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between'
  }
};

export { AccountListItem };
