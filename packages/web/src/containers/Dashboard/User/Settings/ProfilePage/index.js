/**
 *
 * ProfilePage
 *
 */

import React, { Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from 'reactstrap';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ApolloConsumer } from 'react-apollo';

import { ReactstrapInput } from 'utils/formiik';
import { GlobalConsumer } from 'GlobalState';
import { ChangeUserPassword } from 'graphql/mutations';
import { transformApolloErr } from 'utils/apollo';
import Avatar from 'components/Avatar';

// @FIXME: DUPLICATED CODE, CHECK RESETPASSWORDPAGE
function equalTo(ref, msg) {
  return this.test({
    name: 'equalTo',
    exclusive: false,
    /* eslint-disable-next-line no-template-curly-in-string */
    message: msg || '${path} must be the same as ${reference}',
    params: {
      reference: ref.path,
    },
    test(value) {
      return value === this.resolve(ref);
    },
  });
}
Yup.addMethod(Yup.string, 'equalTo', equalTo);

/* eslint-disable react/prefer-stateless-function */
export default class ProfilePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      alertMessage: undefined,
      changePasswordErrMsg: '',
      changePasswordModal: false,
    };

    this.toggleChangePasswordModal = this.toggleChangePasswordModal.bind(this);
  }

  toggleChangePasswordModal() {
    this.setState(prevState => ({
      changePasswordModal: !prevState.changePasswordModal,
    }));
  }

  render() {
    const { changePasswordErrMsg, alertMessage } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>ProfilePage</title>
          <meta name="description" content="Description of ProfilePage" />
        </Helmet>
        <ApolloConsumer>
          {client => (
            <GlobalConsumer>
              {({ setAuthTokens, userProfile }) => (
                <Fragment>
                  {alertMessage && (
                    <Alert
                      color={alertMessage.color}
                      fade={false}
                      className="text-center"
                    >
                      <strong>{alertMessage.text}</strong>
                    </Alert>
                  )}

                  <h1 className="mb-3">My Profile</h1>
                  <Card body>
                    <Row className="align-items-center">
                      <Col xs="auto">
                        <Avatar
                          width="64"
                          height="64"
                          src={`data:image/svg+xml;base64,${
                            userProfile.avatar
                          }`}
                        />
                      </Col>
                      <Col xs="auto">
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                          className="mb-0"
                        >
                          Change Picture
                        </p>
                        <p style={{ fontWeight: 200, fontSize: 14 }}>
                          Max file size is 20Mb
                        </p>
                      </Col>
                      <Col xs="2">
                        <Button disabled>Upload</Button>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col xs="12" sm="4">
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                          className="mb-0"
                        >
                          Change Password
                        </p>
                        <p style={{ fontWeight: 200, fontSize: 14 }}>
                          Enable 2-factor authentication on{' '}
                          <NavLink to="/dashboard/settings/security">
                            the security page
                          </NavLink>
                          .
                        </p>
                      </Col>
                      <Col sm="2">
                        <Button onClick={this.toggleChangePasswordModal}>
                          Change Password
                        </Button>
                        <Modal
                          isOpen={this.state.changePasswordModal}
                          toggle={this.toggleChangePasswordModal}
                        >
                          <ModalHeader toggle={this.toggleChangePasswordModal}>
                            Change Password
                          </ModalHeader>

                          <Formik
                            initialValues={{
                              oldPassword: '',
                              newPassword: '',
                              confirmNewPassword: '',
                            }}
                            validationSchema={Yup.object().shape({
                              oldPassword: Yup.string().required('Required'),
                              newPassword: Yup.string().required('Required'),
                              confirmNewPassword: Yup.string()
                                .equalTo(
                                  Yup.ref('newPassword'),
                                  'Password does not match',
                                )
                                .required('Required'),
                            })}
                            onSubmit={async (values, formikBag) => {
                              this.setState({
                                changePasswordErrMsg: '',
                              });

                              try {
                                const {
                                  data: {
                                    changeUserPassword: {
                                      accessToken,
                                      refreshToken,
                                    },
                                  },
                                } = await client.mutate({
                                  mutation: ChangeUserPassword,
                                  variables: {
                                    ...values,
                                  },
                                });

                                await setAuthTokens({
                                  accessToken,
                                  refreshToken,
                                });

                                formikBag.resetForm();

                                this.setState({
                                  alertMessage: {
                                    color: 'success',
                                    text:
                                      'Your account password has been successfully changed',
                                  },
                                  changePasswordModal: false,
                                });

                                setTimeout(() => {
                                  this.setState({ alertMessage: undefined });
                                }, 3500);
                              } catch (e) {
                                const err = transformApolloErr(e);

                                if (err.type === 'BAD_USER_INPUT') {
                                  formikBag.setErrors(err.data);
                                } else {
                                  this.setState({
                                    changePasswordErrMsg: err.message,
                                  });
                                }

                                formikBag.setSubmitting(false);
                              }
                            }}
                          >
                            {({ isSubmitting }) => (
                              <Fragment>
                                <Form>
                                  <ModalBody>
                                    {changePasswordErrMsg && (
                                      <Alert
                                        color="danger"
                                        role="alert"
                                        fade={false}
                                      >
                                        <strong>
                                          ERROR: {changePasswordErrMsg}
                                        </strong>
                                      </Alert>
                                    )}
                                    <Field
                                      component={ReactstrapInput}
                                      label="Old password"
                                      name="oldPassword"
                                      type="password"
                                      autoComplete="current-password"
                                      required
                                    />
                                    <Field
                                      component={ReactstrapInput}
                                      label="New password"
                                      name="newPassword"
                                      type="password"
                                      autoComplete="new-password"
                                      required
                                    />
                                    <Field
                                      component={ReactstrapInput}
                                      label="Confirm New Password"
                                      name="confirmNewPassword"
                                      type="password"
                                      autoComplete="off"
                                      required
                                    />
                                    <Alert
                                      color="warning"
                                      style={{ fontSize: 15 }}
                                    >
                                      A password change will result in a force
                                      logout on all devices
                                    </Alert>
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button
                                      color="secondary"
                                      size="lg"
                                      onClick={this.toggleChangePasswordModal}
                                    >
                                      Cancel
                                    </Button>{' '}
                                    <Button
                                      type="submit"
                                      color="success"
                                      size="lg"
                                      disabled={isSubmitting}
                                    >
                                      <FontAwesomeIcon
                                        pulse
                                        icon={faSpinner}
                                        className={
                                          isSubmitting ? 'mr-2' : 'd-none'
                                        }
                                      />
                                      Change Password
                                    </Button>
                                  </ModalFooter>
                                </Form>
                              </Fragment>
                            )}
                          </Formik>
                        </Modal>
                      </Col>
                    </Row>
                    <hr />
                    <span>Change email address</span>
                    <hr />
                    <span>Change personal details</span>
                  </Card>
                </Fragment>
              )}
            </GlobalConsumer>
          )}
        </ApolloConsumer>
      </Fragment>
    );
  }
}

ProfilePage.propTypes = {};
