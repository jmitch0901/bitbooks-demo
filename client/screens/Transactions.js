import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';
import { Card, CardBody } from 'reactstrap';
import QueryString from 'query-string';

import {
  IncomingTransactionsWidget,
  FilterBarWidget
} from '../components/widgets';

class Transactions extends Component {
  componentWillMount() {
    if (!this.props.history.search) {
      this.props.history.replace({
        search: '?sortBy=txTime&sortDirection=ASC'
      });
    }
    this.props.loadIncomingTransactions();
    this.props.loadRecordTypes();
  }

  componentDidUpdate(props) {
    if (this.props.location.search !== props.location.search) {
      // New location props should override the old ones
      const oldSearch = QueryString.parse(props.location.search);
      const newSearch = QueryString.parse(this.props.location.search);
      const mergedResult = { ...oldSearch, ...newSearch };
      const { page, limit, sortBy, sortDirection, coinSymbol } = mergedResult;
      this.props.loadIncomingTransactions(
        page,
        limit,
        sortBy,
        sortDirection,
        coinSymbol
      );
      this.props.history.replace({
        search: QueryString.stringify(mergedResult)
      });
    }
  }

  renderWidget = () => {
    const { transactionsToApprove, location, history } = this.props;
    if (transactionsToApprove.length > 0) {
      return (
        <div>
          <Card>
            <CardBody>
              <h1>Incoming Transactions</h1>
            </CardBody>
          </Card>
          <FilterBarWidget location={location} history={history} />
          <IncomingTransactionsWidget location={location} history={history} />
        </div>
      );
    }
    return (
      <Card>
        <Jumbotron style={{ margin: 0 }}>
          <h1>Huzzah!</h1>
          <br />
          <h3>There are no Incoming Transactions to Approve.</h3>
          <h3>Check back here when more transactions come in.</h3>
        </Jumbotron>
      </Card>
    );
  };

  render() {
    return this.renderWidget();
  }
}

const styles = {
  heading: {
    fontSize: '21pt',
    fontWeight: 600
  }
};

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as TransactionActions from '../actions/TransactionActions';
import * as RecordActions from '../actions/RecordActions';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { ...TransactionActions, ...RecordActions },
    dispatch
  );
}

function mapStateToProps(state) {
  const { transactionsToApprove } = state.TransactionsReducer;

  return { transactionsToApprove };
}

Transactions = connect(mapStateToProps, mapDispatchToProps)(Transactions);

export { Transactions };
