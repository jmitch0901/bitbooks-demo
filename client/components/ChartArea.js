import React, { Component } from 'react';

import { Chart, Axis, Series, Tooltip, Cursor, Line } from "react-charts";
import Moment from 'moment';


class ChartArea extends Component {

  renderChart = (dataSet) => {

    const data = [{
      label: "Series 1",
      data: dataSet
    }];

    return (
      <Chart data={data}>
        <Axis primary type="time" position="bottom"/>
        <Axis type="linear" position="left" />
        <Series type={Line} />
        <Cursor primary />
        <Cursor />
        <Tooltip />
      </Chart>
    );
  };

  render() {

    const { transactions } = this.props;

    const dataSet = transactions
    .filter(tx => tx.spendTx <= 0)
    .map(tx => {
      return [ Moment(tx.txTime).toDate(), tx.chartMeta.receiveTx ];
    });

    console.log(dataSet);

    return (
      <div style={styles.chartContainer}>
        {this.renderChart(dataSet)}
      </div>
    );
  }
}

const styles = {
  chartContainer: {
    height: 500
  }
}

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as AccountActions from '../actions/AccountActions';

function mapStateToProps(state){

  const {
    selectedTransactions
  } = state.AccountsReducer;

  return {
    transactions: selectedTransactions
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(AccountActions, dispatch);
}

ChartArea = connect(mapStateToProps, mapDispatchToProps)(ChartArea);

export { ChartArea };
