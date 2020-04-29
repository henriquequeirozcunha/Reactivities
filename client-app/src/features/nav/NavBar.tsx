import React, { useContext } from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import './styles.css';
import ActivityStore from '../../app/stores/activityStore';


export const Navbar : React.FC = () => {

  const activityStore = useContext(ActivityStore)
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header name="home">
          <img src="/assets/logo.png" alt="logo"/>
        </Menu.Item>
        <Menu.Item name="messages" />
        <Menu.Item>
          <Button onClick={activityStore.openCreateForm} positive content="Create Activity" />
        </Menu.Item>
      </Container>
    </Menu>
  );
};
