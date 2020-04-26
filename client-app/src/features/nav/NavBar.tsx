import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import './styles.css';

interface IProps {
  openCreateForm : () => void;
}

export const Navbar : React.FC<IProps> = ({openCreateForm}) => {
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header name="home">
          <img src="/assets/logo.png" alt="logo"/>
        </Menu.Item>
        <Menu.Item name="messages" />
        <Menu.Item>
          <Button onClick={() => openCreateForm()} positive content="Create Activity" />
        </Menu.Item>
      </Container>
    </Menu>
  );
};
