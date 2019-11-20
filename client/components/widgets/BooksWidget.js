import React, { Component } from 'react';
import Moment from 'moment';
import { Link } from 'react-router-dom';

import { Container, Row, Col, Jumbotron, Input, Alert } from 'reactstrap';

import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardHeader,
  CardSubtitle,
  Button
} from 'reactstrap';

import { Tooltip } from 'reactstrap';

import { FaBook } from 'react-icons/fa';

class BooksWidget extends Component {
  state = {
    hoveredAccountID: null,
    hoveredFees: false,
    hoveredSTCG: false,
    hoveredLTCG: false
  };

  toggleTooltip = accountId => {
    this.setState({
      hoveredAccountID: this.state.hoveredAccountID === null ? accountId : null
    });
  };

  renderTrackedIncomeSection = () => {
    const { trackedIncome } = this.props;

    return Object.keys(trackedIncome).map((coinSymbol, index) => {
      const coinAccount = trackedIncome[coinSymbol];

      return (
        <div key={coinSymbol}>
          <div style={styles.lineContainer}>
            <div>
              <img
                style={{ maxHeight: '21px', margin: '0 6px 0 0' }}
                src={`/assets/img/crypto/${coinSymbol}.png`}
              />
              <strong style={styles.coinText}>{coinSymbol}</strong>
            </div>
            <div style={styles.amountContainer}>
              <Tooltip
                isOpen={this.state.hoveredAccountID === coinSymbol}
                toggle={() => this.toggleTooltip(coinSymbol)}
                delay={{ show: 0, hide: 0 }}
                placement="top"
                target={`hover-coin-book-${coinSymbol}`}
              >
                View Income Records for "{coinSymbol}" Coin
              </Tooltip>
              <div>${coinAccount.balance.toFixed(2)}</div>
              <Link
                id={`hover-coin-book-${coinSymbol}`}
                to={`/records?recordType=INC&coinSymbol=${coinSymbol}`}
                style={styles.amountIcon}
              >
                <FaBook />
              </Link>
            </div>
          </div>
          {index !== Object.keys(trackedIncome).length - 1 && <hr />}
        </div>
      );
    });
  };

  renderTrackedIncome = () => {
    const { transactionsForYear, accountLookup, trackedIncome } = this.props;
    // Data Structure:
    /*
    {
      "ZEN": {
        balance: 12.20,
        accounts: {
          "accountId": {
            name: "ZenMiningAccount"
            _id: fgdft546456y45yu464u,
            balance: 11.15
          }, ...
        }
      }, ...
    }
    */
    const totalTrackedIncome = Object.keys(trackedIncome).reduce((p, c) => {
      return p + trackedIncome[c].balance;
    }, 0);

    return (
      <Card>
        <CardHeader
          style={Object.assign({}, styles.lineContainer, styles.cardHeader)}
        >
          <div>Tracked Income</div>
          <div>${totalTrackedIncome.toFixed(2)}</div>
        </CardHeader>
        <CardBody>{this.renderTrackedIncomeSection()}</CardBody>
      </Card>
    );
  };

  renderExpenses = () => {
    const { trackedExpenses } = this.props;
    const { transactionFees = 0, electricityCosts = 0 } = trackedExpenses;
    const expenseTotal = transactionFees + electricityCosts;
    return (
      <Card>
        <CardHeader
          style={Object.assign({}, styles.lineContainer, styles.cardHeader)}
        >
          <div>Tracked Expenses</div>
          <div>${expenseTotal.toFixed(2)}</div>
        </CardHeader>
        <CardBody>
          <div style={styles.lineContainer}>
            <div>Transaction Fees</div>
            <div style={styles.amountContainer}>
              <Tooltip
                isOpen={this.state.hoveredFees}
                toggle={() => {
                  this.setState({ hoveredFees: !this.state.hoveredFees });
                }}
                delay={{ show: 0, hide: 0 }}
                placement="top"
                target={`hover-fees-register`}
              >
                View Book for Transaction Fees
              </Tooltip>
              <div>${transactionFees.toFixed(2)}</div>
              <Link
                id={`hover-fees-register`}
                to={`/accounts/fees?recordType=FEE`}
                style={styles.amountIcon}
              >
                <FaBook />
              </Link>
            </div>
          </div>
          {/* TODO <div style={styles.lineContainer}>
            <div>Electricity Costs</div>
            <div>$0.00 | <a href="#" style={{fontSize: '9pt'}}>View Register</a></div>
          </div> */}
        </CardBody>
      </Card>
    );
  };

  renderCapitalGainsSection = isShortTerm => {
    const { capitalGains } = this.props;
    const subKey = isShortTerm ? 'shortTerm' : 'longTerm';
    return Object.keys(capitalGains).map((coinSymbol, index) => {
      return (
        <div key={`${coinSymbol}-${subKey}`}>
          <div style={styles.lineContainer}>
            <div>
              <img
                style={{ maxHeight: '21px', margin: '0 6px 0 0' }}
                src={`/assets/img/crypto/${coinSymbol}.png`}
              />
              <strong style={styles.coinText}>{coinSymbol}</strong>
            </div>
            <div style={styles.amountContainer}>
              ${capitalGains[coinSymbol][subKey].toFixed(2)}
            </div>
          </div>
          {index !== Object.keys(capitalGains).length - 1 && <hr />}
        </div>
      );
    });
  };

  render() {
    return (
      <div>
        <Card style={{ padding: '12px' }}>
          <Row>
            <Col lg="12">
              <Alert color="warning">
                To see recorded transactions, you need to first accept some
                incoming transactions from the blockchain. <br />
                Go to the "Incoming Transactions" on the side panel and accept
                some transactions.
                <br />
                Then, come back here and select year "2018". Finally, click the
                "book" icon to see your register for accepted transactions.
              </Alert>
            </Col>
            <Col lg="12">
              {this.renderTrackedIncome()}
              <br />
            </Col>
            <Col lg="12">
              {this.renderExpenses()}
              <br />
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

const styles = {
  header: {
    display: 'flex',
    flex: 1,
    padding: '12px 20px'
  },
  lineContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between'
  },
  amountContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '16pt'
  },
  accountAmountContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12pt'
  },
  amountIcon: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '6px'
  },
  cardHeader: {
    backgroundColor: '#c9c7c7',
    fontSize: '14pt'
  },
  coinText: {
    fontSize: '16pt'
  },
  subAccount: {
    paddingLeft: '18px'
  },
  capitalGainsSectionContainer: {},
  capitalGainsItemContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '9px'
  }
};

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as AccountActions from '../../actions/AccountActions';

function mapStateToProps(state) {
  const {
    trackedIncome,
    trackedExpenses,
    accountLookup,
    availableYears,
    selectedYear
  } = state.AccountsReducer;

  return {
    availableYears,
    selectedYear,
    accountLookup,
    trackedIncome,
    trackedExpenses
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch);
}

BooksWidget = connect(mapStateToProps, mapDispatchToProps)(BooksWidget);

export { BooksWidget };
