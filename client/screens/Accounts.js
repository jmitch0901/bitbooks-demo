import React, { Component } from 'react';
import { Container, Row, Col, Jumbotron, Card } from 'reactstrap';
import { FaPlus, FaWallet } from 'react-icons/fa';
import {
  InventoryPiechartWidget,
  AccountsWidget,
  BooksWidget
} from '../components/widgets';

import { YearSelector } from '../components/common';

class Accounts extends Component {
  componentWillMount() {
    this.props.init();
    this.props.loadAccountsSummary();
    this.props.loadAccountsAvailableYears();
  }

  renderIntroduction = () => {
    return (
      <Row style={{ margin: 0 }}>
        <Col lg="6" style={{ padding: '0 1px 0 0' }}>
          <Row>
            <Col lg="12">
              <div style={styles.widgetContainer}>
                <AccountsWidget />
              </div>
            </Col>
          </Row>
        </Col>
        <Col lg="6" style={{ padding: '0 0 0 1px' }}>
          <div style={styles.widgetContainer}>
            <Jumbotron style={{ padding: '21px' }}>
              <h2>Welcome to BitBooks!</h2>
              <br />
              <h4>
                <ul>
                  <li>
                    To start tracking your crypto income, we need to add your
                    first account.
                  </li>
                  <br />
                  <li>
                    An account is simply a grouping of public wallet addresses,
                    fit for your personal needs.
                  </li>
                  <br />
                  <li>
                    (Example: If I mine Ethereum to 3 different public
                    addresses, I might create an account named{' '}
                    <strong>ETH Mining Account</strong> to hold all the
                    addresses.)
                  </li>
                  <br />
                  <li>
                    Add your first account by selecting the{' '}
                    <FaPlus
                      style={{
                        color: 'white',
                        backgroundColor: '#007bff',
                        padding: '2px'
                      }}
                    />{' '}
                    sign.
                  </li>
                </ul>
              </h4>
            </Jumbotron>
          </div>
        </Col>
      </Row>
    );
  };

  renderAddWalletMessage = () => {
    return (
      <Col lg="12">
        <div style={styles.widgetContainer}>
          <Jumbotron style={{ padding: '21px', marginTop: '6px' }}>
            <h2>Nice!</h2>
            <br />
            <h4>
              <ul>
                <li>Now it's time to add your first public wallet address.</li>
                <br />
                <li>
                  Once added, you will see your blockchain transactions start to
                  populate under the <strong>Incoming Transactions</strong> tab.
                </li>
                <br />
                <li>
                  Note that it will take several minutes for your transactions
                  to appear under the <strong>Incoming Transactions</strong>{' '}
                  tab, and may need to refresh page.
                </li>
                <br />
                <li>
                  Click the{' '}
                  <span style={{ color: '#007bff', fontSize: '11pt' }}>
                    <FaPlus /> <FaWallet />
                  </span>{' '}
                  icon to add your first public wallet address.
                </li>
              </ul>
            </h4>
          </Jumbotron>
        </div>
      </Col>
    );
  };

  renderAccounts = () => {
    const userDoesHaveWallets = this.props.wallets.length > 0;
    return (
      <Row style={{ margin: 0 }}>
        <Col lg="6" style={{ padding: '0 1px 0 0' }}>
          <Row>
            <Col lg="12">
              <div style={styles.widgetContainer}>
                <InventoryPiechartWidget />
              </div>
            </Col>
            <Col lg="12">
              <div style={styles.widgetContainer}>
                <AccountsWidget />
              </div>
            </Col>
            {userDoesHaveWallets ? null : this.renderAddWalletMessage()}
          </Row>
        </Col>
        <Col lg="6" style={{ padding: '0 0 0 1px' }}>
          <div style={styles.widgetContainer}>
            <BooksWidget />
          </div>
        </Col>
      </Row>
    );
  };

  render() {
    const userDoesHaveAccounts = this.props.accounts.length > 0;
    return (
      <Container fluid style={{ padding: 0 }}>
        <Card>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 12px'
            }}
          >
            <h1>Books and Accounts</h1>
            {userDoesHaveAccounts ? <YearSelector /> : null}
          </div>
        </Card>
        {userDoesHaveAccounts
          ? this.renderAccounts()
          : this.renderIntroduction()}
      </Container>
    );
  }
}

const styles = {
  widgetContainer: {
    // padding: '3px'
  }
};

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as AppActions from '../actions/AppActions';
import * as AccountActions from '../actions/AccountActions';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...AppActions, ...AccountActions }, dispatch);
}

function mapStateToProps(state) {
  const { accounts, wallets } = state.AccountsReducer;
  const { transactions } = state.TransactionsReducer;
  const { pageLoading } = state.AppReducer;
  return { accounts, wallets, transactions, pageLoading };
}

Accounts = connect(mapStateToProps, mapDispatchToProps)(Accounts);

export { Accounts };
