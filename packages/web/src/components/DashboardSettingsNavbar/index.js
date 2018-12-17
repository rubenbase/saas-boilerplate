/**
 *
 * DashboardSettingsNavbar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink as RRNavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Container, Col, Row, Nav, NavItem, NavLink } from 'reactstrap';
import styled from 'styled-components';

const SideNav = styled.div`
  .nav-item {
    padding: 0.2rem 0 0.2rem 0;
  }

  .nav-link {
    color: #888;
    padding: 0.3rem 0.5rem 0.3rem 1rem;
    border-left: 2px solid transparent;
  }

  .nav-link:hover {
    color: #777;
  }

  .nav-link.active {
    color: #666;
    border-left: 2px solid #d9534f;
  }
`;

/* eslint-disable react/prefer-stateless-function */
class DashboardSettingsNavbar extends React.PureComponent {
  render() {
    const { children } = this.props;

    return (
      <Container style={{ marginTop: '2rem' }}>
        <Row>
          <Col md={{ size: 3, order: 2 }} tag="main">
            <SideNav>
              <h3>Settings</h3>
              <Nav className="flex-column">
                <NavItem>
                  <NavLink to="/dashboard/settings" exact tag={RRNavLink}>
                    My Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to="/dashboard/settings/preferences"
                    exact
                    tag={RRNavLink}
                  >
                    Preferences
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to="/dashboard/settings/security"
                    exact
                    tag={RRNavLink}
                  >
                    Account Security
                  </NavLink>
                </NavItem>
              </Nav>
            </SideNav>
          </Col>
          <Col md={{ size: 9, order: 1 }} tag="aside">
            {children}
          </Col>
        </Row>
      </Container>
    );
  }
}

DashboardSettingsNavbar.propTypes = {
  children: PropTypes.node,
};

export default withRouter(DashboardSettingsNavbar);
