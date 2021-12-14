import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
  } from "shards-react";

class MenuBar extends React.Component {
    render() {
        return(
            <Navbar type="light" theme="success" expand="md">
              <NavbarBrand href="/">CIS 550 Final Project</NavbarBrand>
              <Nav navbar>
                <NavItem>
                    <NavLink active href="/analysis">
                    Analysis
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active  href="/trends" >
                    Trends
                  </NavLink>
                </NavItem>
                  <NavItem>
                    <NavLink active href="/recs" >
                      Recs
                    </NavLink>
                  </NavItem>
              </Nav>
            </Navbar>
        )
    }
}

export default MenuBar
