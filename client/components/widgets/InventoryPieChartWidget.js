import React, { Component } from 'react';
import { Card, CardBody, Container, Row, Col, Button, ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap';
import { Link } from 'react-router-dom';

import 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { FaBook } from 'react-icons/fa';

import { CoinPieChartColors } from '../../config';

class InventoryPiechartWidget extends Component {

    state={
        hoveredCoinSymbol: null
    }

    renderCurrentInventory = () => {
        const { accountsSummary } = this.props;
        const coinItems = Object.keys(accountsSummary).map((coinSymbol, index) => {
            const coinItem = accountsSummary[coinSymbol];
            const { balance, coinBalance } = coinItem;
            return (
                <ListGroupItem key={index} style={this.state.hoveredCoinSymbol === coinSymbol ? {backgroundColor: 'lightgreen'} : {}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <img style={{maxHeight: '21px', margin: '0 6px 0 0'}} src={`/assets/img/crypto/${coinSymbol}.png`} />
                            <strong>{coinSymbol}</strong>            
                        </div>
                        <div>{coinBalance.toFixed(2)} {coinSymbol}</div>
                        <div>${balance.toFixed(2)}</div>
                        {/* <Link to={`/records?coinSymbol=${coinSymbol}`}>
                            <FaBook />
                        </Link> */}
                    </div>
                </ListGroupItem>
            )
        });
        return (
            <ListGroup>
                {coinItems}
            </ListGroup>
        )
    }

    renderPiechart = () => {

        const { data, options } = this.props;
        options.tooltips = {
            callbacks: {
                label: (tooltipItem, data) => {
                    const { index } = tooltipItem;
                    const coinSymbol = data.labels[index];
                    this.setState({ hoveredCoinSymbol: coinSymbol });
                    return coinSymbol;
                }
            }
        };

        return (
            <div style={styles.chartArea} onMouseOut={() => this.setState({ hoveredCoinSymbol: null })}>
                <Doughnut data={data} options={options}/>
            </div>          
        );       
    }

    render() {
        return (
            <Card>
                <h3 style={styles.title}>Current Inventory</h3>
                <CardBody style={{ padding: '0 0 12px 0' }}>
                    <Container fluid>
                        <Row>
                            <Col lg="12" style={{ padding: '0 0 12px 0', display: 'flex', justifyContent: 'center' }}>
                                {this.renderPiechart()}
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="12">
                                {this.renderCurrentInventory()}
                            </Col>
                        </Row>                 
                    </Container>                    
                </CardBody>           
            </Card>
        );
    }
}

const styles = {
    chartArea: {
        display: 'block',
        maxHeight: '200px'
    },
    title: {
        padding: '12px'
    }
}

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as AccountActions from '../../actions/AccountActions';

function mapStateToProps(state){
  const { accountsSummary } = state.AccountsReducer;

  // Take the account summary. Turn it into something a pie chart can understand
  const data = {
      labels: [],
      datasets: [{
          data: [],
          backgroundColor: []
      }]
  };

  const options = {
    showTooltips: false,
    reponsive: true,
    maintainAspectRatio: false,
    legend: {
        display: false
    }
  };

  Object.keys(accountsSummary).forEach(coinSymbol => {
    const coinSummary = accountsSummary[coinSymbol];
    data.labels.push(coinSymbol);
    data.datasets[0].data.push(coinSummary.balance.toFixed(2));
    data.datasets[0].backgroundColor.push(CoinPieChartColors[coinSymbol]);
  });

  return { data, options, accountsSummary };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(AccountActions, dispatch);
}

InventoryPiechartWidget = connect(mapStateToProps, mapDispatchToProps)(InventoryPiechartWidget);

export { InventoryPiechartWidget }