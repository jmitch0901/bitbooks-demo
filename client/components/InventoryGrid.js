import React, { Component } from 'react';
import { Col, Row } from 'reactstrap'

import { InventoryGridItem } from './common';

class InventoryGrid extends Component {

  renderItems = (inventoryAccounts) => {
    const columns = inventoryAccounts.map(acc => {
      return (
        <Col key={acc._id} lg="3">
          <InventoryGridItem inventoryAccount={acc} />
        </Col>
      )
    });

    const rows = [];

    for (let i = 0; i <= columns.length; i+=3) {
      rows.push(<Row key={i}>{columns.slice(i, i+4)}</Row>);
    }

    return rows;
  }

  render() {

    const { inventoryAccounts } = this.props;

    return(
      <div>
        {this.renderItems(inventoryAccounts)}
      </div>
    )
  }
}

export { InventoryGrid }
