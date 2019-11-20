import React, { Component } from 'react';

import { Container, Row, Col, Alert } from 'reactstrap';
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';
import Particles from 'react-particles-js';
import { withRouter } from 'react-router-dom';

class Login extends Component {
  state = {
    username: '',
    password: ''
  };

  login = () => {
    const { username, password } = this.state;
    this.props.authenticate(username, password, () => {
      this.props.history.replace('/accounts');
    });
  };

  onSubmit = e => {
    e.preventDefault();
  };

  getCopyright = () => {
    return `${new Date().getFullYear()} BITZERK LLC - JON MITCHELL - ALL RIGHTS RESERVED.`;
  };

  render() {
    return (
      <Container fluid style={styles.container}>
        <Particles
          style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }}
          params={{
            particles: {
              number: {
                value: '100'
              },
              line_linked: {
                color: '#b5b5b5',
                width: '1'
              }
            }
          }}
        />
        <Row style={styles.heading}>
          <Col lg="4"></Col>
          <Col lg="4">
            <div>
              <h1
                style={{
                  fontSize: '60pt',
                  fontWeight: '600',
                  paddingBottom: '12px'
                }}
              >
                BitBooks
              </h1>
              <p style={{ fontSize: '16pt' }}>
                Welcome to BitBooks! <br />
              </p>
              <Alert color="warning">
                THIS IS DEMO MODE - Sign in with your Demo credentials to
                continue.
                <br />
                Username: demouser
                <br />
                Pasword: demouser
              </Alert>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg="4"></Col>
          <Col lg="4" style={{ paddingTop: '21px' }}>
            <Card>
              <CardBody>
                <center>
                  <strong>
                    <h3 style={{ fontWeight: 600, paddingBottom: '6px' }}>
                      Login With Demo Account
                    </h3>
                  </strong>
                </center>
                <Form onSubmit={this.onSubmit}>
                  <FormGroup>
                    <Label for="username">Username</Label>
                    <Input
                      type="text"
                      name="username"
                      value={this.state.username}
                      onChange={e =>
                        this.setState({ username: e.target.value })
                      }
                    ></Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                      type="password"
                      name="password"
                      value={this.state.password}
                      onChange={e =>
                        this.setState({ password: e.target.value })
                      }
                    ></Input>
                  </FormGroup>
                  <Button type="submit" onClick={this.login}>
                    Submit
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row style={styles.copyrightContainer}>
          <Col lg="4"></Col>
          <Col lg="4">
            <div style={styles.copyright}>&#169; {this.getCopyright()}</div>
          </Col>
        </Row>
      </Container>
    );
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    paddingTop: '3%',
    display: 'flex',
    flexDirection: 'column'
  },
  heading: {
    textAlign: 'center',
    paddingTop: '32px'
  },
  copyrightContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end'
  },
  copyright: {
    paddingTop: '32px',
    textAlign: 'center'
  }
};

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as AuthActions from '../actions/AuthActions';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AuthActions, dispatch);
}

Login = withRouter(connect(null, mapDispatchToProps)(Login));

export { Login };
