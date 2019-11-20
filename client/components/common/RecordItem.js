import React, { Component } from 'react';
import {
  FaEllipsisV,
  FaEdit,
  FaTh,
  FaTrash,
  FaCheck,
  FaExclamationTriangle,
  FaSync,
  FaUnlink
} from 'react-icons/fa';
import Moment from 'moment';

import {
  Popover,
  PopoverHeader,
  PopoverBody,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  Button
} from 'reactstrap';

import { MODAL_VIEW_PARENT_TRANSACTION } from '../../modals/types';
import { SimpleSpinner } from './SimpleSpinner';

class RecordItem extends Component {
  state = {
    isReloadingRecord: false
  };

  _doTogglePopover = (forceClose = false) => {
    const { record } = this.props;
    this.props.onPopoverItemSelected &&
      this.props.onPopoverItemSelected(record, forceClose);
  };

  _showParentTxModal = () => {
    const { record } = this.props;
    this._doTogglePopover(true);
    this.props.showModal(MODAL_VIEW_PARENT_TRANSACTION, { extras: { record } });
  };

  render() {
    const { record, doShowPopover } = this.props;
    const {
      _id,
      blockRecord,
      txTime,
      coinSymbol,
      type,
      increase,
      decrease,
      runningBalance = 0,
      runningCoinBalance = 0
    } = record;
    return (
      <tr style={styles.tableData}>
        <td style={styles.tableData}>
          <div style={{ textAlign: 'center' }}>
            <img
              style={{ maxHeight: '21px' }}
              src={`/assets/img/crypto/${record.coinSymbol}.png`}
            />
            <div>{coinSymbol}</div>
          </div>
        </td>
        <td style={styles.tableData}>
          <div>{Moment(txTime).format('MM/DD/YYYY')}</div>
          <div style={styles.time}>{Moment(txTime).format('hh:mm a')}</div>
        </td>
        <td style={{ verticalAlign: 'inherit' }}>{type}</td>
        <td style={{ verticalAlign: 'inherit' }}>
          <div>${blockRecord.timeOfTxValue.toFixed(2)}</div>
        </td>
        <td style={styles.tableData}>
          <div>
            {record.coinIncrease.toFixed(8)} {record.coinSymbol}
          </div>
          <div>${increase.toFixed(2)}</div>
        </td>
        <td style={styles.tableData}>
          <div>
            {record.coinDecrease.toFixed(8)} {record.coinSymbol}
          </div>
          <div>${decrease.toFixed(2)}</div>
        </td>
        <td style={styles.tableData}>
          <div>
            {runningCoinBalance.toFixed(8)} {record.coinSymbol}
          </div>
          <div>${runningBalance.toFixed(2)}</div>
        </td>
        <td style={{ verticalAlign: 'inherit' }}>
          <FaEllipsisV
            id={`record-popover-${_id}`}
            style={{ cursor: 'pointer' }}
            onClick={this._doTogglePopover}
          />
          <Popover
            placement="left"
            isOpen={doShowPopover}
            target={`record-popover-${_id}`}
            toggle={this._doTogglePopover}
          >
            <PopoverBody style={{ padding: 0 }}>
              <ListGroup>
                <ListGroupItem>
                  <strong>Parent TX Actions</strong>
                </ListGroupItem>
                <ListGroupItem style={styles.listGroupItem}>
                  <Button
                    color="link"
                    style={styles.editItem}
                    onClick={this._showParentTxModal}
                  >
                    <FaTh />
                    <div style={styles.editItemText}>View/Edit</div>
                  </Button>
                </ListGroupItem>
              </ListGroup>
            </PopoverBody>
          </Popover>
        </td>
      </tr>
    );
  }
}

const styles = {
  link: {
    fontSize: '9pt'
  },
  tableData: {
    padding: '.25rem'
  },
  logoContainer: {
    maxWidth: '24px'
  },
  listGroupItem: {
    padding: 0
  },
  editItem: {
    cursor: 'pointer',
    display: 'flex',
    padding: '12px',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: '12pt',
    minWidth: '75px',
    width: '100%'
  },
  editItemText: {
    paddingLeft: '12px'
  }
};

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as TransactionActions from '../../actions/TransactionActions';
import * as RecordActions from '../../actions/RecordActions';
import * as ModalActions from '../../actions/ModalActions';

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { ...TransactionActions, ...RecordActions, ...ModalActions },
    dispatch
  );
}

RecordItem = connect(mapStateToProps, mapDispatchToProps)(RecordItem);

export { RecordItem };
