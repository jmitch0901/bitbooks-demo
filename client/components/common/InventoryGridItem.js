import React from 'react';

import { Card, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap';

const InventoryGridItem = props => {
  const { coinSymbol, coinCount, wallets } = props.inventoryAccount;

  return (
    <Card>
      <CardBody>
        <CardTitle>Ethereum</CardTitle>
        <CardSubtitle>{coinSymbol}</CardSubtitle>
      </CardBody>
      <CardBody style={styles.imgContainer}>
        <img src={`/assets/img/crypto/eth.png`} style={styles.img} />
      </CardBody>
      <CardBody>
        <CardText>
          {coinCount} {coinSymbol}
        </CardText>
        <CardText>${(coinCount * 100).toFixed(2)} USD</CardText>
      </CardBody>
    </Card>
  );
};

const styles = {
  imgContainer: {
    margin: 'auto'
  },
  img: {
    maxHeight: 64,
    display: 'block'
  }
};

export { InventoryGridItem };
