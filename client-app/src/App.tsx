import React from 'react';

import './App.css';
import { Header, Icon, List } from 'semantic-ui-react'

function App() {
  return (
    <div className="App">
      <Header as='h2'>
        <Icon name='users' />
        <Header.Content>
          Reactivities
        </Header.Content>
      </Header>

      <List>
        <List.Item>Apples</List.Item>
        <List.Item>Pears</List.Item>
        <List.Item>Oranges</List.Item>
      </List>
    </div>
  );
}

export default App;
