/**
 *
 * MainPage
 *
 */

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Container, Button } from 'reactstrap';
import { Helmet } from 'react-helmet';

import { ChangeUserEmail } from 'graphql/mutations';

// import { GlobalConsumer } from 'GlobalState';
import SafeMutation from 'components/graphql/SafeMutation';

/* eslint-disable react/prefer-stateless-function */
export default class MainPage extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Dashboard index</title>
          <meta
            name="description"
            content="Description of User dashboard main page"
          />
        </Helmet>
        <Container tag="main">
          <SafeMutation
            mutation={ChangeUserEmail}
            variables={{ password: 'foo', newEmail: 'foo2@foo.com' }}
          >
            {changeUserEmail => (
              <Fragment>
                <Button onClick={() => changeUserEmail()}>
                  CHANGE MY EMAIL!
                </Button>
              </Fragment>
            )}
          </SafeMutation>
        </Container>
      </Fragment>
    );
  }
}

MainPage.propTypes = {};
