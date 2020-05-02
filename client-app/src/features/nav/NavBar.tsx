import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import "./styles.css";

import {  NavLink } from "react-router-dom";

export const Navbar: React.FC = () => {

  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item
          header
          name="home"
          as={NavLink}
          to="/"
          exact
        >
          <img src="/assets/logo.png" alt="logo" />
        </Menu.Item>
        <Menu.Item name="messages" as={NavLink} to="/activities" />
        <Menu.Item>
          <Button
            as={NavLink}
            to="/createActivity"
            positive
            content="Create Activity"
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
};
