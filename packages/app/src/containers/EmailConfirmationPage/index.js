/**
 *
 * EmailConfirmationPage
 *
 */

import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useAsyncEffect } from 'use-async-effect';
import { Helmet } from 'react-helmet';
import { Container, Row, Col, Alert } from 'reactstrap';
import queryString from 'query-string';
import { withApollo } from 'react-apollo';

import { ConfirmUserEmail } from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';
import { AnalyticsApi } from 'api/vendors';
import Loader from 'components/Loader';

function EmailConfirmationPage(props) {
  const [alertMessage, setAlertMessage] = useState({});
  const { location, client } = props;

  const urlParams = queryString.parse(location.search);

  const { token } = urlParams;

  useAsyncEffect(
    async () => {
      try {
        await client.mutate({
          mutation: ConfirmUserEmail,
          variables: { confirmationToken: token || '' },
        });
        AnalyticsApi.track('Email verified');

        setAlertMessage({
          color: 'success',
          text: 'YOUR EMAIL HAS BEEN VERIFIED!',
        });
      } catch (e) {
        const err = transformApolloErr(e);

        setAlertMessage({ color: 'danger', text: err.message });
      }
    },
    undefined,
    [],
  );

  return (
    <Fragment>
      <Helmet>
        <title>Email confirmation</title>
        <meta
          name="description"
          content="Description of EmailConfirmationPage"
        />
      </Helmet>
      <Container tag="main" className="flex flex-column justify-content-center">
        <Row>
          <Col md="12" className="text-center">
            {alertMessage ? (
              <Alert color={alertMessage.color}>
                <strong>{alertMessage.text}</strong>
              </Alert>
            ) : (
              <Loader />
            )}
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}

EmailConfirmationPage.propTypes = {
  location: PropTypes.object,
  client: PropTypes.object,
};

export default withApollo(EmailConfirmationPage);