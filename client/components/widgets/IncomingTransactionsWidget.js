import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { Card, CardBody } from 'reactstrap';
import { Collapse, Alert } from 'reactstrap';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

import { SortableHeader } from '../common';

import { TransactionInspectionWidget } from './';

class IncomingTransactionsWidget extends Component {
  componentWillUnmount() {
    this.props.inspectTransaction(null);
  }

  selectRow = (index, tx) => {
    this.props.selectTransaction(tx);
  };

  inspectTransaction = tx => {
    this.props.inspectTransaction(tx);
  };

  renderTransactionInspectionWidgetRow = tx => {
    const { inspectedTransaction } = this.props;
    return (
      <tr key={tx._id + '-INSPECTED'} style={styles.rowInspected}>
        <td colSpan="8" style={{ padding: 0 }}>
          <Collapse
            isOpen={inspectedTransaction && inspectedTransaction._id === tx._id}
          >
            <TransactionInspectionWidget />
          </Collapse>
        </td>
      </tr>
    );
  };

  renderRows = transactionsToApprove => {
    const {
      transactionsToApprovePagination,
      inspectedTransaction
    } = this.props;
    const { page, limit } = transactionsToApprovePagination;
    const starter = (page - 1) * limit;
    const renderedRows = transactionsToApprove.map((tx, index) => {
      const {
        blockheight,
        coinSymbol,
        txDate,
        txTime,
        receiveTx,
        spendTx,
        txFee,
        timeOfTxValue,
        netTotal,
        netValue
      } = tx.chartMeta;
      return (
        <tr
          key={tx._id}
          style={Object.assign(
            {},
            { cursor: 'pointer', minHeight: '73px' },
            tx.isSelected ? styles.rowSelected : {}
          )}
        >
          <td
            style={styles.tableData}
            onClick={() => this.selectRow(index, tx)}
          >
            <div style={{ textAlign: 'center' }}>
              <img
                style={{ maxHeight: '21px' }}
                src={`/assets/img/crypto/${coinSymbol}.png`}
              />
              <div>{coinSymbol}</div>
            </div>
          </td>
          <td
            style={styles.tableData}
            onClick={() => this.selectRow(index, tx)}
          >
            {txDate}
            <br />
            {txTime}
          </td>
          <td
            style={Object.assign(
              {},
              { verticalAlign: 'inherit' },
              styles.tableData
            )}
            onClick={() => this.selectRow(index, tx)}
          >
            ${timeOfTxValue.toFixed(2)}
          </td>
          <td
            style={styles.tableData}
            onClick={() => this.selectRow(index, tx)}
          >
            {receiveTx} {coinSymbol}
            <br />${(timeOfTxValue * receiveTx).toFixed(2)}
          </td>
          <td
            style={styles.tableData}
            onClick={() => this.selectRow(index, tx)}
          >
            {spendTx} {coinSymbol}
            <br />${(timeOfTxValue * spendTx).toFixed(2)}
          </td>
          <td
            style={styles.tableData}
            onClick={() => this.selectRow(index, tx)}
          >
            {txFee} {coinSymbol}
            <br />${(timeOfTxValue * txFee).toFixed(2)}
          </td>
          <td
            style={styles.tableData}
            onClick={() => this.selectRow(index, tx)}
          >
            {netTotal} {coinSymbol}
            <br />${(timeOfTxValue * netTotal).toFixed(2)}
          </td>
          <td
            style={Object.assign(
              {},
              {
                verticalAlign: 'inherit',
                textAlign: 'center',
                borderLeft: '1px solid lightgray'
              },
              styles.tableData
            )}
            onClick={() => this.inspectTransaction(tx)}
          >
            <div>
              {inspectedTransaction && inspectedTransaction._id === tx._id ? (
                <FaAngleUp />
              ) : (
                <FaAngleDown />
              )}
            </div>
          </td>
        </tr>
      );
    });

    for (let i = 0; i < renderedRows.length; i += 2) {
      if (i > renderedRows.length - 1) {
        break;
      }
      const tx = transactionsToApprove[i / 2];
      renderedRows.splice(
        i + 1,
        0,
        this.renderTransactionInspectionWidgetRow(tx)
      );
    }

    return renderedRows;
  };

  render() {
    const { transactionsToApprove, location } = this.props;
    if (transactionsToApprove.length === 0) {
      // Then don't render this component
      return null;
    }
    return (
      <Card>
        <CardBody>
          <Alert color="warning">
            Use this screen to see which transactions are being read from the
            blockchain, given your tracked wallet addresses.
            <br />
            <br />
            This gives the user a chance to:
            <ol>
              <li>Accept a transaction (record it to your books)</li>
              <li>Discard a transaction (don't record it to your books)</li>
              <li>
                Inspect a transaction (make some edits before you record it to
                your books)
              </li>
            </ol>
            You need to accept transactions here before they will be visible in
            the "Books & Summary" tab.
            <br />
            You can also use the "Select All Shown" coupled with "Bulk Actions",
            to accept all selected transactions.
          </Alert>
        </CardBody>

        <Table style={Object.assign({}, styles.table, styles.tableFixed)}>
          <thead>
            <tr>
              {/* <th style={{textAlign: 'center'}}>#</th> */}
              {/* <th>
                <Input style={styles.rowCheckbox} type="checkbox" />
              </th> */}
              <th style={{ textAlign: 'center' }}>
                <SortableHeader
                  to="/transactions"
                  sortBy="coinSymbol"
                  currentLocation={location}
                >
                  Coin
                </SortableHeader>
              </th>
              <th>
                <SortableHeader
                  to="/transactions"
                  sortBy="txTime"
                  currentLocation={location}
                >
                  TX Time
                </SortableHeader>
              </th>
              <th>
                <SortableHeader
                  to="/transactions"
                  sortBy="timeOfTxValue"
                  currentLocation={location}
                >
                  Value TOT
                </SortableHeader>
              </th>
              <th>
                <SortableHeader
                  to="/transactions"
                  sortBy="receiveTx"
                  currentLocation={location}
                >
                  Receive
                </SortableHeader>
              </th>
              <th>
                <SortableHeader
                  to="/transactions"
                  sortBy="spendTx"
                  currentLocation={location}
                >
                  Send
                </SortableHeader>
              </th>
              <th>
                <SortableHeader
                  to="/transactions"
                  sortBy="txFee"
                  currentLocation={location}
                >
                  Fee
                </SortableHeader>
              </th>
              <th>Net Total</th>
              <th style={styles.inspectHeader}>Inspect</th>
            </tr>
          </thead>
        </Table>
        <div>
          <Table style={Object.assign({}, styles.table, styles.tableFixed)}>
            <tbody>{this.renderRows(transactionsToApprove)}</tbody>
          </Table>
        </div>
      </Card>
    );
  }
}

const styles = {
  table: {
    fontSize: '11pt',
    margin: 0,
    verticalAlign: 'none'
  },
  tableFixed: {
    tableLayout: 'fixed'
  },
  tableData: {
    padding: '.25rem'
  },
  rowSelected: {
    backgroundColor: 'lightgreen'
  },
  rowInspected: {
    backgroundColor: 'lightgray'
  },
  rowCheckbox: {
    margin: 0,
    position: 'relative'
  },
  inspectHeader: {
    textAlign: 'center',
    borderLeft: '1px solid lightgray'
  }
};

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as TransactionActions from '../../actions/TransactionActions';

function mapStateToProps(state) {
  const {
    transactionsToApprovePagination,
    selectedTransactionIds,
    inspectedTransaction
  } = state.TransactionsReducer;

  // Add true/false value if tx is selected
  const transactionsToApprove = state.TransactionsReducer.transactionsToApprove.map(
    tx => {
      tx.isSelected = selectedTransactionIds.has(tx._id);
      return tx;
    }
  );

  return {
    transactionsToApprovePagination,
    transactionsToApprove,
    inspectedTransaction
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TransactionActions, dispatch);
}

IncomingTransactionsWidget = connect(
  mapStateToProps,
  mapDispatchToProps
)(IncomingTransactionsWidget);

export { IncomingTransactionsWidget };
