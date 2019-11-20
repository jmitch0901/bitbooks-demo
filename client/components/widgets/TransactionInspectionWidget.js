import React, { Component } from 'react';
import {
  Container,
  Col,
  Row,
  Table,
  Card,
  ButtonGroup,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import { FaTrash, FaEdit, FaCheck } from 'react-icons/fa';
import Moment from 'moment';

class TransactionInspectionWidget extends Component {
  state = {
    isReadView: true,
    timeOfTxValue: 0,
    potentialRecords: [],
    netAmount: 0
  };

  componentWillReceiveProps() {
    this.setState({ isReadView: true });
  }

  doAcceptTransaction = () => {
    const { inspectedTransaction } = this.props;
    const callbacks = this.props.onActionComplete;

    if (this.state.isReadView) {
      return this.props.acceptTransaction(inspectedTransaction, callbacks);
    }

    const updatedTransaction = {
      ...inspectedTransaction,
      timeOfTxValue: this.state.timeOfTxValue
    };

    // Otherwise, commit our potential records (AKA edited records)
    this.props.acceptTransaction(
      { ...updatedTransaction, records: this.state.potentialRecords },
      callbacks
    );
  };

  doDiscardTransaction = () => {
    const { inspectedTransaction } = this.props;
    this.props.discardTransaction(inspectedTransaction);
  };

  doModifyRecords = () => {
    if (!this.state.isReadView) {
      return this.setState({ isReadView: true });
    }
    const { recordTypes, inspectedTransaction } = this.props;
    const { records } = inspectedTransaction;

    const netAmount = records.reduce((prev, curr) => {
      const { increase, decrease } = curr;
      return prev + (increase - decrease);
    }, 0);

    // Initialize state if modifying
    this.setState({
      isReadView: false,
      potentialRecords: records,
      timeOfTxValue: inspectedTransaction.timeOfTxValue.toFixed(2),
      netAmount
    });
  };

  renderNetAmount = () => {
    let netAmount = 0;

    if (this.state.isReadView) {
      netAmount = this.props.inspectedTransaction.records.reduce(
        (prev, curr) => {
          const { increase, decrease } = curr;
          return prev + (increase - decrease);
        },
        0
      );
    } else {
      netAmount = this.state.potentialRecords.reduce((prev, curr) => {
        const { increase, decrease } = curr;
        return prev + (increase - decrease);
      }, 0);
    }

    if (isNaN(netAmount)) {
      return 'N/A';
    }

    return '$' + netAmount.toFixed(2);
  };

  // NOTE - I don't think I want users to do this
  // _onRowRemoved = (record) => {
  //   const potentialRecords = [ ...this.state.potentialRecords ].filter(r => r._id !== record._id);
  //   this.setState({ potentialRecords });
  // }

  renderRecords = records => {
    const {
      inspectedTxAccount,
      recordTypes,
      inspectedTransaction
    } = this.props;

    const { inspectionFromRecord } = this.props;

    if (this.state.isReadView) {
      return records.map((r, index) => {
        // Return read view
        return (
          <tr
            key={r._id}
            style={
              inspectionFromRecord && inspectionFromRecord._id === r._id
                ? styles.fromRecord
                : {}
            }
          >
            <td>{index + 1}</td>
            <td>{inspectedTxAccount.name}</td>
            <td>
              <div>{Moment(r.txTime).format('MM/DD/YYYY')}</div>
              <div style={styles.time}>
                {Moment(r.txTime).format('hh:mm a')}
              </div>
            </td>
            <td>{r.type}</td>
            <td>${inspectedTransaction.timeOfTxValue.toFixed(2)}</td>
            <td>
              <div>
                {r.coinIncrease} {r.coinSymbol}
              </div>
              <div>${r.increase.toFixed(2)}</div>
            </td>
            <td>
              <div>
                {r.coinDecrease} {r.coinSymbol}
              </div>
              <div>${r.decrease.toFixed(2)}</div>
            </td>
          </tr>
        );
      });
    }

    // Otherwise return edit view
    return this.state.potentialRecords.map((r, index) => {
      return (
        <tr
          key={r._id}
          style={
            inspectionFromRecord && inspectionFromRecord._id === r._id
              ? styles.fromRecord
              : {}
          }
        >
          {/* <td style={styles.inspectionRowButton}
            onClick={() => this._onRowRemoved(r)}
          >
            <FaMinusCircle style={{color: 'red'}} />
          </td> */}
          <td>{index + 1}</td>
          <td>{inspectedTxAccount.name}</td>
          <td>
            <div>{Moment(r.txTime).format('MM/DD/YYYY')}</div>
            <div style={styles.time}>{Moment(r.txTime).format('hh:mm a')}</div>
          </td>
          <td>
            <Input
              type="select"
              name="type"
              value={r.type}
              onChange={e => this.updateRecordTypeState(e, r)}
            >
              {recordTypes.map(rt => {
                const { type, label } = rt;
                return (
                  <option
                    key={type}
                    value={type}
                  >{`${type} - ${label}`}</option>
                );
              })}
            </Input>
          </td>
          <td>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <Input
                name="valueTot"
                type="number"
                min="0"
                step="any"
                value={this.state.timeOfTxValue}
                onChange={e => this.updateValueTotState(e)}
              />
            </InputGroup>
          </td>
          <td>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText
                  style={{ minWidth: '56px', textAlign: 'center' }}
                >
                  {r.coinSymbol}
                </InputGroupText>
              </InputGroupAddon>
              <Input
                name="increase"
                type="number"
                min="0"
                step="any"
                value={r.coinIncrease}
                onChange={e => this.updateRecordState(e, r)}
              />
            </InputGroup>
          </td>
          <td>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText
                  style={{ minWidth: '56px', textAlign: 'center' }}
                >
                  {r.coinSymbol}
                </InputGroupText>
              </InputGroupAddon>
              <Input
                name="decrease"
                type="number"
                min="0"
                step="any"
                value={r.coinDecrease}
                onChange={e => this.updateRecordState(e, r)}
              />
            </InputGroup>
          </td>
        </tr>
      );
    });
  };

  updateRecordTypeState = (event, potentialRecord) => {
    const { value } = event.target;
    const potentialRecords = [...this.state.potentialRecords].map(r => {
      if (r._id === potentialRecord._id) {
        return { ...potentialRecord, type: value };
      }
      return r;
    });
    this.setState({ potentialRecords });
  };

  updateValueTotState = event => {
    const timeOfTxValue = event.target.value;
    const potentialRecords = [...this.state.potentialRecords].map(r => {
      const increase = (r.coinIncrease * timeOfTxValue).toFixed(2);
      const decrease = (r.coinDecrease * timeOfTxValue).toFixed(2);
      return { ...r, increase, decrease };
    });
    this.setState({ timeOfTxValue, potentialRecords });
  };

  updateRecordState = (event, potentialRecord) => {
    const { name, value } = event.target;

    const recordKey = `coin${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    const counterKey = name;
    const counterValue = (value * this.state.timeOfTxValue).toFixed(2); // Value for Currency

    const potentialRecords = [...this.state.potentialRecords].map(r => {
      if (r._id === potentialRecord._id) {
        return {
          ...potentialRecord,
          [recordKey]: value,
          [counterKey]: counterValue
        };
      }
      return r;
    });
    this.setState({ potentialRecords });
  };

  renderBreakdownSummary = (
    netAmount,
    publicAddress,
    inspectedTxAccount,
    inspectedTxWallet
  ) => {
    const walletDiv = (
      <h4 style={{ display: 'inline-block' }}>
        <div>Wallet</div>
        <hr />
        <div style={styles.walletContainer}>
          <div style={styles.walletName}>{inspectedTxWallet.name}</div>
          <div style={styles.publicAddress}>{publicAddress}</div>
        </div>
      </h4>
    );

    const accountDiv = (
      <h4 style={{ display: 'inline-block' }}>
        <div>Account</div>
        <hr />
        <div style={styles.walletName}>{inspectedTxAccount.name}</div>
      </h4>
    );

    return (
      <div style={styles.breakdownHeader}>
        <div style={styles.breakdownHeaderContent}>
          {netAmount >= 0 ? walletDiv : accountDiv}
        </div>
        <div style={styles.breakdownHeaderContent}>
          <h2>&#8594;</h2>
        </div>
        <div style={styles.breakdownHeaderContent}>
          {netAmount >= 0 ? accountDiv : walletDiv}
        </div>
      </div>
    );
  };

  renderTotalsDiv = () => {
    const { records, coinSymbol } = this.props.inspectedTransaction;

    const recordsToRender = this.state.isReadView
      ? records
      : this.state.potentialRecords;

    const coinTotal = recordsToRender
      .reduce((p, c) => p + (c.coinIncrease - c.coinDecrease), 0)
      .toFixed(8);
    const total = recordsToRender
      .reduce((p, c) => p + (c.increase - c.decrease), 0)
      .toFixed(2);

    return (
      <div style={styles.totalTextDiv}>
        <div>
          {coinTotal} {coinSymbol}
        </div>
        <div>${total}</div>
      </div>
    );
  };

  _onAction = action => {
    switch (action) {
      case 'MODIFY': {
        this.doModifyRecords();
        break;
      }
      case 'ACCEPT': {
        this.doAcceptTransaction();
        break;
      }
      case 'DISCARD': {
        this.doDiscardTransaction();
        this.props.onActionComplete && this.props.onActionComplete();
        break;
      }
    }
  };

  renderButtonSection = () => {
    return (
      <ButtonGroup style={{ width: '100%', fontSize: '14pt' }}>
        <Button
          style={{ flex: 1 }}
          color="danger"
          onClick={() => this._onAction('DISCARD')}
        >
          <FaTrash /> Discard
        </Button>
        <Button
          color="warning"
          style={{ flex: 1 }}
          onClick={() => this._onAction('MODIFY')}
        >
          {this.state.isReadView ? (
            <span>
              <FaEdit /> Modify
            </span>
          ) : (
            'Cancel Edit'
          )}
        </Button>
        <Button
          style={{ flex: 1 }}
          color="success"
          onClick={() => this._onAction('ACCEPT')}
        >
          <FaCheck /> Accept
        </Button>
      </ButtonGroup>
    );
  };

  render() {
    const {
      title,
      inspectedTransaction,
      inspectedTxAccount,
      inspectedTxWallet
    } = this.props;
    if (!inspectedTransaction || !inspectedTxAccount || !inspectedTxWallet) {
      return <div style={{ minHeight: '405px' }}></div>;
    }
    const { publicAddress, name } = inspectedTxWallet;
    const { records } = inspectedTransaction;
    const netAmount = records.reduce((prev, curr) => {
      const { increase, decrease } = curr;
      return prev + (increase - decrease);
    }, 0);
    return (
      <Container style={{ fontSize: '11pt', padding: '12px' }} fluid>
        <Row>
          <Col lg="12">
            <Card style={styles.container}>
              <div style={styles.cardHeader}>
                <div>
                  <h2>{title || 'Record Breakdown'}</h2>
                  <h5>
                    TX Hash:{' '}
                    <span style={{ fontSize: '11pt' }}>
                      {inspectedTransaction.txid}
                    </span>
                  </h5>
                </div>
                <div>
                  <img
                    style={{ maxHeight: '75px', padding: '6px' }}
                    src={`/assets/img/crypto/${inspectedTransaction.coinSymbol}.png`}
                  />
                </div>
              </div>
              <hr />
              {this.renderBreakdownSummary(
                netAmount,
                publicAddress,
                inspectedTxAccount,
                inspectedTxWallet
              )}
              <br />
              <Table>
                <thead>
                  <tr>
                    {/* {this.state.isReadView ? null : <th></th>} */}
                    <th>#</th>
                    <th>Account</th>
                    <th>TX Time</th>
                    <th>Record Type</th>
                    <th>Value TOT</th>
                    <th>Increase</th>
                    <th>Decrease</th>
                  </tr>
                </thead>
                <tbody>{this.renderRecords(records)}</tbody>
              </Table>
              <div style={styles.footer}>
                <div style={{ flex: 1 }}></div>
                <div style={styles.buttonSection}>
                  {this.renderButtonSection()}
                </div>
                <div style={styles.totalDiv}>
                  <h3 style={{ margin: 'auto 0' }}>Balance &#8594; </h3>
                  {this.renderTotalsDiv()}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

const styles = {
  container: {
    minHeight: '200px',
    padding: '12px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  breakdownHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 25% 12px 25%'
  },
  breakdownHeaderContent: {
    display: 'flex',
    flexBasis: 0,
    flexGrow: 1,
    justifyContent: 'center',
    textAlign: 'center'
  },
  walletContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  walletName: {
    fontSize: '16pt'
  },
  publicAddress: {
    display: 'inline-block',
    fontSize: '10pt'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  buttonDiv: {
    flex: 1,
    margin: 'auto'
  },
  totalDiv: {
    flex: 1,
    display: 'flex',
    justifyContent: 'right',
    padding: '0 6px'
  },
  totalTextDiv: {
    fontSize: '14pt',
    paddingLeft: '24px',
    textAlign: 'right'
  },
  buttonSection: {
    display: 'flex',
    flex: 2,
    justifyContent: 'center'
  },
  inspectionRowButton: {
    cursor: 'pointer'
  },
  fromRecord: {
    backgroundColor: 'lightgreen'
  }
};

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as AccountActions from '../../actions/AccountActions';
import * as TransactionActions from '../../actions/TransactionActions';
import * as RecordActions from '../../actions/RecordActions';

function mapStateToProps(state) {
  const {
    inspectedTransaction,
    inspectedTxWallet,
    inspectedTxAccount
  } = state.TransactionsReducer;

  const { recordTypes } = state.RecordsReducer;

  return {
    inspectedTransaction,
    inspectedTxWallet,
    inspectedTxAccount,
    recordTypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { ...AccountActions, ...TransactionActions, ...RecordActions },
    dispatch
  );
}

TransactionInspectionWidget = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionInspectionWidget);

export { TransactionInspectionWidget };
