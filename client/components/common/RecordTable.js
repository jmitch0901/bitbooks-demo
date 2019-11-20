import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Table, Card, CardBody, Alert } from 'reactstrap';

import { RecordItem } from './';

class RecordTable extends Component {
  state = {
    clickedRecordId: null
  };

  _onPopoverItemSelected = record => {
    const clickedRecordId =
      this.state.clickedRecordId === record._id ? null : record._id;
    this.setState({ clickedRecordId });
  };

  renderRecords = records => {
    return records.map((r, index) => {
      const doShowPopover = this.state.clickedRecordId === r._id;
      return (
        <RecordItem
          key={r._id}
          index={index}
          record={r}
          onPopoverItemSelected={this._onPopoverItemSelected}
          doShowPopover={doShowPopover}
        />
      );
    });
  };

  render() {
    const { records } = this.props;

    return (
      <Card>
        <CardBody>
          <Alert color="warning">
            This screen shows which transactions your have previously accepted,
            as well as your account's running balance over time. You can modify
            a record by clicking the "three dots" icon, next each record.
          </Alert>
        </CardBody>
        <Table
          striped
          style={Object.assign({}, styles.table, styles.tableFixed)}
        >
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Coin</th>
              <th>Date</th>
              <th>Record Type</th>
              <th>Value TOT</th>
              <th>Increase</th>
              <th>Decrease</th>
              <th>Running Balance</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{this.renderRecords(records)}</tbody>
        </Table>
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
  }
};

//redux
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return state;
}

RecordTable = connect(mapStateToProps)(RecordTable);
RecordTable = withRouter(RecordTable);

export { RecordTable };
