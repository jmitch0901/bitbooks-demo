import React, { Component } from "react";
import { Jumbotron, Container, Col, Row, Button, Card } from "reactstrap";
import { RecordTable } from "../../components/common";

import QueryString from "query-string";
import { withRouter } from "react-router-dom";

import { FaAngleLeft } from "react-icons/fa";

import { Paginator } from "../../components/common";

class Register extends Component {
  componentWillMount() {
    // Only for account ids
    const { match } = this.props;
    console.log("MATCH: ", match);
    const { page, limit, coinSymbol } = this.getQueryStringMap();
    switch (match.path) {
      case `/accounts/fees`: {
        return this.props.loadFeeRecords();
      }
      default: {
        this.props.loadCoinRecords(coinSymbol, page, limit, "INC");
      }
    }
  }

  componentDidUpdate(props) {
    if (this.props.location.search !== props.location.search) {
      const { loadedCoin } = this.props;
      const { page, limit } = this.getQueryStringMap(props);
      this.props.loadCoinRecords(loadedCoin, page, limit);
    }
  }

  getQueryStringMap = props => {
    // New location props should override the old ones
    const oldSearch = props ? QueryString.parse(props.location.search) : {};
    const newSearch = QueryString.parse(this.props.location.search);
    const mergedResult = { ...oldSearch, ...newSearch };
    return mergedResult;
  };

  getCoinBalance = loadedRecords => {
    const coinBalance = loadedRecords
      .reduce((prev, curr) => {
        let balance = prev;
        balance += curr.parentTransaction.receiveTx;
        balance -= curr.parentTransaction.spendTx;
        return balance;
      }, 0)
      .toFixed(8);
    return coinBalance;
  };

  renderMainContent = () => {
    const { loadedRecords, loadedCoin, selectedYear } = this.props;

    if (!loadedRecords || loadedRecords.length === 0) {
      return (
        <Jumbotron>
          <h1>No Records in Account</h1>
        </Jumbotron>
      );
    }

    const {
      total,
      coinTotal,
      page,
      pages,
      limit,
      recordCountNeedingSync
    } = this.props;

    return (
      <div>
        <Card>
          <Jumbotron style={{ padding: "12px", margin: 0 }}>
            <Container fluid>
              <Row>
                <Col lg="12">
                  <h1>{selectedYear}</h1>
                  <hr />
                </Col>
                <Col lg="6">
                  <Row>
                    <Col lg="2" style={styles.logoContainer}>
                      <img
                        style={{ width: "100%", padding: "6px" }}
                        src={`/assets/img/crypto/${loadedCoin}.png`}
                      />
                    </Col>
                    <Col lg="10">
                      <h1>{loadedCoin}</h1>
                    </Col>
                  </Row>
                </Col>
                <Col lg="6">
                  <h1>Tracked Balance:</h1>
                  <h3>
                    {coinTotal.toFixed(8)} {loadedCoin} | ${total.toFixed(2)}
                  </h3>
                </Col>
              </Row>
            </Container>
          </Jumbotron>
        </Card>
        <Card>
          <div style={styles.pageContainer}>
            <Paginator
              page={page}
              pages={pages}
              limit={limit}
              increments={[25, 50, 100, 250, 500]}
            />
          </div>
        </Card>
        <Card>
          <RecordTable records={loadedRecords} />
        </Card>
      </div>
    );
  };

  render() {
    return (
      <div>
        <Card>
          <Button
            style={styles.goBackButton}
            onClick={this.props.history.goBack}
            color="link"
          >
            <FaAngleLeft /> Go Back
          </Button>
        </Card>
        {this.renderMainContent()}
      </div>
    );
  }
}

const styles = {
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around"
  },
  goBackButton: {
    display: "flex",
    alignItems: "center",
    fontSize: "12pt"
  },
  pageContainer: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "6px"
  }
};

//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// actions
import * as RecordActions from "../../actions/RecordActions";

function mapStateToProps(state) {
  const {
    loadedRecords,
    loadedCoin,
    pagination,
    total,
    coinTotal
  } = state.RecordsReducer;
  const { selectedYear } = state.AccountsReducer;

  const { page, pages, limit } = pagination;

  return {
    page,
    pages,
    limit,
    total,
    coinTotal,
    loadedRecords,
    loadedCoin,
    selectedYear
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(RecordActions, dispatch);
}

Register = connect(mapStateToProps, mapDispatchToProps)(Register);
Register = withRouter(Register);

export { Register };
