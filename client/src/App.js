import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import {
  BrowserRouter as Router,
  Route as DefaultRoute,
  Switch,
} from 'react-router-dom';

import DefaultLayout from 'layout';

import PrivateRoute from 'components/PrivateRoute/Loadable';
import RouteAnalytics from 'components/RouteAnalytics';
import ScrollToTop from 'components/ScrollToTop';
import NotFoundPage from 'components/NotFoundPage/Loadable';

import HomePage from 'containers/HomePage/Loadable';
import ContactPage from 'containers/ContactPage/Loadable';
import SignupPage from 'containers/SignupPage/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import ForgotPasswordPage from 'containers/ForgotPasswordPage/Loadable';
import ResetPasswordPage from 'containers/ResetPasswordPage/Loadable';
import EmailConfirmationPage from 'containers/EmailConfirmationPage/Loadable';

const Route = ({
  component: Component,
  layout: Layout = DefaultLayout,
  ...rest
}) => (
  <DefaultRoute
    {...rest}
    render={props => {
      let privateRoute = null;
      if (rest.protected) {
        privateRoute = <PrivateRoute exact path={rest.path} />;
      }

      return (
        <React.Fragment>
          {privateRoute}
          <RouteAnalytics key={rest.path} {...props}>
            <Layout>
              <Component {...props} />
            </Layout>
          </RouteAnalytics>
        </React.Fragment>
      );
    }}
  />
);

Route.propTypes = {
  component: PropTypes.func,
  layout: PropTypes.func,
  protected: PropTypes.bool,
};

export default function App() {
  return (
    <Fragment>
      <Helmet titleTemplate="%s - SaaS boilerplate" />
      <Router>
        <ScrollToTop>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/signup" component={SignupPage} />
            <Route exact path="/auth/login" component={LoginPage} />

            <Route component={NotFoundPage} />
          </Switch>
        </ScrollToTop>
      </Router>
    </Fragment>
  );
}
