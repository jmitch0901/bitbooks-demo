import React, { Component } from 'react';
import { Container, Col, Row, Pagination, PaginationItem, PaginationLink, Badge } from 'reactstrap';
import { ButtonDropdown, ButtonGroup, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { Card } from 'reactstrap';

import QueryString from 'query-string';

import { Paginator } from '../common';

class FilterBarWidget extends Component {

  state={
    showAmountFilter: false,
    showByCoinFilter: false,
    showBulkActions: false
  }

  componentWillMount() {
    this.props.getFilterableCoins();
  }

  renderSelectAll = () => {
    const { allTransactionsSelected } = this.props;
    return (
      <InputGroup style={{margin: '0 6px', cursor: 'pointer'}} onClick={this.props.selectAllTransactions}>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>
            <Input checked={allTransactionsSelected} addon type="checkbox" aria-label="Checkbox for following text input" style={{cursor: 'pointer'}} />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupText style={{backgroundColor: 'transparent', borderRadius: '0 .25rem .25rem 0', fontSize: '11pt'}}>Select All Shown</InputGroupText>
      </InputGroup>
    );
  }

  limitAmountShown = (limit) => {
    this.props.history.replace({ search: `?limit=${limit}` });
  }

  selectFilterableCoin = (coinSymbol) => {
    console.log('REPLACING')
    this.props.history.replace({ search: `?coinSymbol=${coinSymbol}` });
  }

  renderByCoinFilter = () => {
    const { filterableCoins } = this.props;
    const { location } = this.props;
    const parsedQueryString = QueryString.parse(location.search);
    return (
      <ButtonDropdown isOpen={this.state.showByCoinFilter} toggle={() => this.setState({showByCoinFilter: !this.state.showByCoinFilter})}>
        <DropdownToggle color="primary" caret>
          {
            parsedQueryString.coinSymbol && parsedQueryString.coinSymbol !== 'ALL' ?
              (<span>
                <img src={`/assets/img/crypto/${parsedQueryString.coinSymbol}.png`} style={{maxHeight: '24px'}} />
                <span style={{ marginLeft: '12px' }}>{parsedQueryString.coinSymbol}</span>
              </span>) : 'All Coins'
          }
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem
            style={styles.dropdownItem}
            onClick={() => this.selectFilterableCoin('ALL')}>
            All Coins
          </DropdownItem>
          <DropdownItem divider></DropdownItem>
          {
            filterableCoins.map(coinSymbol => {
              return (
                <DropdownItem
                  key={coinSymbol}
                  disabled={parsedQueryString.coinSymbol === coinSymbol}
                  onClick={() => this.selectFilterableCoin(coinSymbol) }
                  style={{cursor: 'pointer'}}>
                  <img src={`/assets/img/crypto/${coinSymbol}.png`} style={{maxHeight: '24px'}} />
                  <span style={{ marginLeft: '12px' }}>{coinSymbol}</span>
                </DropdownItem>
              )
            })
          }
        </DropdownMenu>
      </ButtonDropdown>
    )
  }

  renderFilters = () => {
    return (
      <div style={{display: 'flex'}}>
        {this.renderSelectAll()}
        <ButtonGroup>
          {this.renderByCoinFilter()}
          {this.renderBulkActions()}
        </ButtonGroup>
          {this.renderSelectedCount()}
      </div>
    )
  }

  doBulkAcceptTransactions = () => {
    const selectedTransactionIds = Array.from(this.props.selectedTransactionIds);
    this.props.bulkAcceptTransactions(selectedTransactionIds, () => {
      this.props.loadIncomingTransactions(this.props.location.search);
    });
  }

  doBulkDiscardTransactions = () => {
    const selectedTransactionIds = Array.from(this.props.selectedTransactionIds);
    this.props.bulkDiscardTransactions(selectedTransactionIds, () => {
      this.props.loadIncomingTransactions(this.props.location.search);
    });
  }

  renderBulkActions = () => {
    const { amountSelected } = this.props;
    return (
        <ButtonDropdown
          disabled={amountSelected === 0}
          isOpen={this.state.showBulkActions}
          toggle={() => this.setState({showBulkActions: !this.state.showBulkActions})}
        >
          <DropdownToggle disabled={amountSelected === 0} color="success" caret>Bulk Actions</DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>{amountSelected} Transactions Selected</DropdownItem>
            <DropdownItem onClick={() => this.doBulkAcceptTransactions()} style={styles.dropdownItem}>Accept Selected</DropdownItem>
            <DropdownItem onClick={() => this.doBulkDiscardTransactions()} style={styles.dropdownItem}>Discard Selected</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
    )
  }

  renderSelectedCount = () => {
    const { amountSelected } = this.props;
    if(amountSelected === 0) {
      return null;
    }
    return (
      <h4 style={styles.addMargin}>
        <Badge>{amountSelected} Selected</Badge>
      </h4>
    )
  }

  render() {
    const { page, pages, limit } = this.props;
    return (
      <Card>
        <div style={styles.container}>
          <div style={styles.filterSection}>
            {this.renderFilters()}
          </div>
          <div style={styles.filterSection}>
            <Paginator page={page} pages={pages} limit={limit} increments={[25, 50, 100, 250]} />
          </div>
        </div>
      </Card>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px',
    justifyContent: 'space-between'
  },
  filterSection: {
    display: 'flex',
    alignItems: 'center'
  },
  addMargin: {
    marginLeft: '6px'
  }
}

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as TransactionActions from '../../actions/TransactionActions';

function mapStateToProps(state){

  const {
    transactionsToApprovePagination,
    inspectedTransaction,
    selectedTransactionIds,
    filterableCoins
  } = state.TransactionsReducer;

  // Add true/false value if tx is selected
  const transactionsToApprove = state.TransactionsReducer.transactionsToApprove.map(tx => {
    tx.isSelected = selectedTransactionIds.has(tx._id);
    return tx;
  });

  const allTransactionsSelected = selectedTransactionIds.size === transactionsToApprove.length;

  // Pagination
  const { page, pages, limit } = transactionsToApprovePagination;

  return {
    page,
    pages,
    limit,

    transactionsToApprovePagination, //TODO remove

    transactionsToApprove,
    inspectedTransaction,
    allTransactionsSelected,
    filterableCoins,
    selectedTransactionIds,
    amountSelected: selectedTransactionIds.size
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(TransactionActions, dispatch);
}

FilterBarWidget = connect(mapStateToProps,mapDispatchToProps)(FilterBarWidget);

export { FilterBarWidget };
