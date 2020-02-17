import React, { Component } from "react";

import PropTypes from "prop-types";

import { AppSidebarToggler } from "@coreui/react";

const propTypes = {
  children: PropTypes.node
};

class DefaultHeader extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        {/* <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
        /> */}
        <AppSidebarToggler className="d-md-down-none" display="lg" />
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;

export default DefaultHeader;
