import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Collapse, Alert } from 'reactstrap';
import { Button } from 'reactstrap';
import { Container, Col, Row } from 'reactstrap';
import { Input } from 'reactstrap';
import { Tooltip } from 'reactstrap';

import {
  FaPlus,
  FaWallet,
  FaPlusSquare,
  FaEdit,
  FaMinusCircle,
  FaCheck
} from 'react-icons/fa';

import { MODAL_ADD_ACCOUNT, MODAL_ADD_WALLET } from '../../modals/types';

// import { AccountList } from '../common';

class AccountsWidget extends Component {
  state = {
    collapseMap: {},
    hoveredEditWalletId: null,
    hoveredAddWalletId: null,
    hoveredAddAccount: false,

    currentAccountEditId: null,
    walletsIdsToDelete: new Set(),
    accountEditName: null,
    accountEditWalletsMap: {}
  };

  cancelAccountEdit = () => {
    this.setState({
      currentAccountEditId: null,
      walletsIdsToDelete: new Set(),
      accountEditName: null,
      accountEditWalletsMap: {},

      hoveredEditWalletId: null,
      hoveredAddWalletId: null,
      hoveredAddAccount: false
    });
    this.props.loadAccountsAndWallets();
  };

  commitAccountChange = () => {
    const accountEditObj = {
      _id: this.state.currentAccountEditId,
      name: this.state.accountEditName
    };
    const walletsToUpdate = this.props.wallets.reduce((prev, w) => {
      const walletShouldUpdate =
        w._id in this.state.accountEditWalletsMap &&
        w.name !== this.state.accountEditWalletsMap[w._id].name;
      if (walletShouldUpdate) {
        return [
          ...prev,
          { ...w, name: this.state.accountEditWalletsMap[w._id].name }
        ];
      }
      return prev;
    }, []);

    // commit our account edits
    this.props.commitAccountChange(accountEditObj, walletsToUpdate, () => {
      // commit our account wallet soft-deletions
      for (const walletId of Array.from(this.state.walletsIdsToDelete)) {
        this.props.deleteWallet(walletId);
      }
      this.cancelAccountEdit();
    });
  };

  editAccount = (acc, accountWallets) => {
    const { _id, name } = acc;
    const accountEditWalletsMap = accountWallets.reduce((p, c) => {
      return { ...p, [c._id]: c };
    }, {});
    this.setState({
      hoveredEditWalletId: null,
      hoveredAddWalletId: null,
      hoveredAddAccount: false,
      currentAccountEditId: _id,
      walletsIdsToDelete: new Set(),
      accountEditName: name,
      accountEditWalletsMap
    });
  };

  deleteWallet = walletId => {
    // Add the wallet ID to our state
    this.setState({
      ...this.state,
      walletsIdsToDelete: new Set([
        ...Array.from(this.state.walletsIdsToDelete),
        walletId
      ])
    });
  };

  toggleShowWallet = (accountId, forceOpen = false) => {
    this.setState({
      collapseMap: {
        ...this.state.collapseMap,
        [accountId]: forceOpen || !this.state.collapseMap[accountId]
      }
    });
  };

  updateWalletText = (walletId, text) => {
    this.setState({
      accountEditWalletsMap: {
        ...this.state.accountEditWalletsMap,
        [walletId]: {
          ...this.state.accountEditWalletsMap[walletId],
          name: text
        }
      }
    });
  };

  renderWallets = wallets => {
    return wallets.map(w => {
      return (
        <ListGroupItem key={w._id} style={styles.walletListItem}>
          <div style={styles.walletName}>{w.name}</div>
          <div style={styles.walletAddress}>
            {w.publicAddress}
            <span style={{ color: 'green', paddingLeft: '6px' }}>
              (tracking)
            </span>
          </div>
        </ListGroupItem>
      );
    });
  };

  renderEditWallets = () => {
    return Object.keys(this.state.accountEditWalletsMap).map(walletId => {
      const wallet = this.state.accountEditWalletsMap[walletId];
      const { _id, name, publicAddress } = wallet;

      if (this.state.walletsIdsToDelete.has(_id)) {
        return null;
      }

      return (
        <ListGroupItem key={walletId} style={styles.walletListItem}>
          <Button
            color="link"
            style={{ color: 'red' }}
            onClick={() => this.deleteWallet(walletId)}
          >
            <FaMinusCircle />
          </Button>
          <div style={styles.walletName}>
            <Input
              type="text"
              value={name}
              onChange={e => this.updateWalletText(walletId, e.target.value)}
              onKeyPress={this.handleInputKeyPress}
            />
          </div>
          <div style={{ padding: '12px' }}>&#8594;</div>
          <div style={styles.walletAddress}>{publicAddress}</div>
        </ListGroupItem>
      );
    });
  };

  toggleTooltip = (type, accountId) => {
    switch (type) {
      case 'ADD_WALLET': {
        this.setState({
          hoveredAddWalletId:
            this.state.hoveredAddWalletId === null ? accountId : null
        });
        break;
      }
      case 'EDIT_ACCOUNT': {
        this.setState({
          hoveredEditWalletId:
            this.state.hoveredEditWalletId === null ? accountId : null
        });
        break;
      }
    }
  };

  handleInputKeyPress = target => {
    switch (target.charCode) {
      case 13: {
        // ENTER
        this.commitAccountChange();
        break;
      }
    }
  };

  renderAccountDropdownItem = (acc, accountWallets) => {
    return (
      <ListGroupItem key={acc._id} style={styles.accountItem}>
        <div style={styles.itemContainer}>
          <div style={styles.coinContainer}>
            <div style={styles.coinImgContainer}>
              <img
                style={styles.coinImgThumb}
                src={`/assets/img/crypto/${acc.coinSymbol}.png`}
              />
            </div>
            <div style={styles.accountCoin}>{acc.coinSymbol}</div>
          </div>
          <div
            style={styles.accountName}
            onClick={() => this.toggleShowWallet(acc._id)}
          >
            {acc.name}
          </div>
          <div style={styles.buttonSection}>
            <Tooltip
              isOpen={this.state.hoveredEditWalletId === acc._id}
              toggle={() => this.toggleTooltip('EDIT_ACCOUNT', acc._id)}
              delay={{ show: 0, hide: 0 }}
              placement="top"
              target={`tooltip-edit-account-${acc._id}`}
            >
              Edit "{acc.name}" account
            </Tooltip>
            <Tooltip
              isOpen={this.state.hoveredAddWalletId === acc._id}
              toggle={() => this.toggleTooltip('ADD_WALLET', acc._id)}
              delay={{ show: 0, hide: 0 }}
              placement="top"
              target={`tooltip-add-wallet-${acc._id}`}
            >
              Add Wallet for "{acc.name}" account
            </Tooltip>
            <Button
              id={`tooltip-edit-account-${acc._id}`}
              style={styles.buttonEditAccount}
              onClick={() => this.editAccount(acc, accountWallets)}
              color="link"
            >
              <FaEdit />
            </Button>
            <Button
              id={`tooltip-add-wallet-${acc._id}`}
              style={styles.buttonAddWallet}
              onClick={() => this.showAddWalletModal(acc)}
              color="link"
            >
              <div>
                <FaPlus /> <FaWallet />
              </div>
            </Button>
          </div>
        </div>
        <Collapse isOpen={!this.state.collapseMap[acc._id]}>
          <ListGroup style={styles.walletListGroup}>
            {this.renderWallets(accountWallets)}
          </ListGroup>
        </Collapse>
      </ListGroupItem>
    );
  };

  renderAccountEditItem = (acc, accountWallets) => {
    return (
      <ListGroupItem key={acc._id} style={styles.accountItem}>
        <div style={styles.itemContainer}>
          <div style={styles.coinContainer}>
            <div style={styles.coinImgContainer}>
              <img
                style={styles.coinImgThumb}
                src={`/assets/img/crypto/${acc.coinSymbol}.png`}
              />
            </div>
            <div style={styles.accountCoin}>{acc.coinSymbol}</div>
          </div>
          <div style={styles.accountName}>
            <Input
              type="text"
              value={this.state.accountEditName}
              onChange={e =>
                this.setState({
                  ...this.state,
                  accountEditName: e.target.value
                })
              }
              onKeyPress={this.handleInputKeyPress}
            />
          </div>
          <div style={styles.buttonSection}>
            <Button
              id={`hover-account-cancel-change-${acc._id}`}
              color="link"
              onClick={this.cancelAccountEdit}
            >
              Cancel
            </Button>
            <Button
              id={`hover-account-accept-change-${acc._id}`}
              onClick={this.commitAccountChange}
              color="link"
            >
              Commit
            </Button>
          </div>
        </div>
        <Collapse isOpen={true}>
          <ListGroup style={styles.walletListGroup}>
            {this.renderEditWallets()}
          </ListGroup>
        </Collapse>
      </ListGroupItem>
    );
  };

  renderListGroupItems = () => {
    const { accounts, wallets } = this.props;
    return accounts.map(acc => {
      const accountWallets = wallets.filter(w => w.account === acc._id);
      if (this.state.currentAccountEditId === acc._id) {
        return this.renderAccountEditItem(acc, accountWallets);
      }
      return this.renderAccountDropdownItem(acc, accountWallets);
    });
  };

  render() {
    const { accounts, wallets } = this.props;
    return (
      <Container fluid>
        <Row>
          <Col lg="12" style={{ padding: 0 }}>
            <ListGroup>
              <ListGroupItem>
                <div style={styles.header}>
                  <h3>Account Tracking Configuration</h3>
                  <Tooltip
                    isOpen={this.state.hoveredAddAccount}
                    toggle={() =>
                      this.setState({
                        hoveredAddAccount: !this.state.hoveredAddAccount
                      })
                    }
                    delay={{ show: 0, hide: 0 }}
                    placement="top"
                    target={`hover-account-add`}
                  >
                    Add New Account
                  </Tooltip>
                  <Button
                    id="hover-account-add"
                    style={styles.buttonAddAccount}
                    onClick={this.showAddAccountModal}
                    color="link"
                  >
                    <FaPlusSquare />
                  </Button>
                </div>
                <Alert color="warning">
                  You can add additional accounts and wallets, but they will not
                  be tracked in demo mode.
                  <br />
                  A "Wallet" is your public blockchain address. This is used to
                  track blockchain transactions.
                  <br />
                  An "Account" is unique to Bitbooks, and is nothing more than a
                  grouping of "Wallet" addresses.
                  <br />
                </Alert>
              </ListGroupItem>
              {this.renderListGroupItems()}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }

  showAddAccountModal = () => {
    this.props.showModal(MODAL_ADD_ACCOUNT);
  };

  showAddWalletModal = parentAccount => {
    this.setState({ hoveredAccountID: null });
    const extras = {
      parentAccount
    };
    this.props.showModal(MODAL_ADD_WALLET, { extras });
  };
}

const styles = {
  accountItem: {
    borderRadius: 0,
    padding: 0,
    backgroundColor: 'rgba(0,0,0,.03)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  itemContainer: {
    display: 'flex'
  },
  coinContainer: {
    display: 'flex',
    minWidth: '130px',
    paddingLeft: '1.25rem',
    borderRight: '1px solid #c9c7c7',
    backgroundColor: '#c9c7c7'
  },
  coinImgContainer: {},
  coinImgThumb: {
    padding: '.75rem 0',
    maxHeight: '54px'
  },
  accountCoin: {
    fontSize: '14pt',
    padding: '.75rem 12px'
  },
  accountName: {
    flex: 5,
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '14pt',
    padding: '.75rem 12px'
  },
  buttonSection: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  buttonAddWallet: {
    display: 'flex',
    paddingTop: '6px',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 0,
    textDecoration: 'none',
    fontSize: '12pt',
    height: '100%'
  },
  buttonEditAccount: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: '18pt',
    height: '100%'
  },
  buttonAddAccount: {
    padding: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1.75rem',
    textDecoration: 'none'
  },
  buttonCancelEdit: {
    color: 'red',
    padding: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1.5rem',
    textDecoration: 'none'
  },
  walletListGroup: {
    // marginLeft: '32px'
  },
  walletListItem: {
    display: 'flex',
    borderRadius: 0,
    borderRight: 0,
    borderLeft: 0,
    borderBottom: 0
  },
  walletName: {
    flex: 1
  },
  walletAddress: {
    flex: 1,
    fontSize: '10pt',
    display: 'flex',
    alignItems: 'center'
  }
};

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as AccountActions from '../../actions/AccountActions';
import * as ModalActions from '../../actions/ModalActions';

function mapStateToProps(state) {
  const { accounts, wallets } = state.AccountsReducer;
  return { accounts, wallets };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...AccountActions, ...ModalActions }, dispatch);
}

AccountsWidget = connect(mapStateToProps, mapDispatchToProps)(AccountsWidget);

export { AccountsWidget };
