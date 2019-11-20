import React, { Component } from 'react';
import { Collapse } from 'reactstrap';
import { AccountListItem, WalletItem } from './index';

class AccountList extends Component {

  state = {
    collapseMap:{}
  }

  toggleListItem = (accountId) => {
    this.setState({
      collapseMap: {
        ...this.state.collapseMap,
        [accountId]: !this.state.collapseMap[accountId]
      }
    });
  };

  renderWallets = (wallets) => {
    return wallets.map(w => {
      return (
        <WalletItem key={w._id} wallet={w} />
      );
    });
  }

  renderAccounts = () => {

    const { wallets, accounts } = this.props;

    return accounts.map(account => {

      const filteredWallets = wallets.filter(w => w.account === account._id);
      const accountBalance = filteredWallets.reduce((p,c) => {
        return p + c.balance;
      }, 0);

      return(
        <div key={account._id}>
          <AccountListItem
            onClick={() => this.toggleListItem(account._id)}
            account={account}
            walletCount={filteredWallets.length}
            accountBalance={accountBalance}
          />
          <Collapse isOpen={!this.state.collapseMap[account._id]}>
            {this.renderWallets(filteredWallets)}
          </Collapse>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        {this.renderAccounts()}
      </div>
    );
  }
}

export { AccountList }
