import React from 'react';

import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';

const AccountCard = props => {
  const { account } = props;
  const { name, coinSymbol } = account;

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle>{name}</CardTitle>
          <CardSubtitle>{coinSymbol}</CardSubtitle>
        </CardBody>
        <CardBody style={styles.imgContainer}>
          <img src={`/assets/img/crypto/eth.png`} style={styles.img} />
        </CardBody>
        <CardBody>jgflkdasjgldfgpadogkpodfak</CardBody>
      </Card>
    </div>
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

export { AccountCard };
