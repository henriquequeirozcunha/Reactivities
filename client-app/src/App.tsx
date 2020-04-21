import React, { useEffect, useState } from 'react';

import './App.css';
import { Header, Icon, List } from 'semantic-ui-react';

import axios from 'axios';

function App() {

  const [values, setValues] = useState([]);

  useEffect(() => {

    async function getValuesFromAPI() {

      const response = await axios.get('http://localhost:5000/api/values');
      setValues(response.data);
      console.log(response.data);
    };

  }, []);

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
