import React, { useEffect, useState } from 'react';

import { Header, Icon, List } from 'semantic-ui-react';

import axios from 'axios';
import { IActivity } from '../models/Activity';
import { Navbar } from '../../features/nav/NavBar';




function App() {

  const [activities, setActivities] = useState<IActivity[]>([]);

  useEffect(() => {

    async function getValuesFromAPI() {

      const response = await axios.get<IActivity[]>('http://localhost:5000/api/values');
      console.log(response.data);
      setActivities(response.data);
      
    };

    getValuesFromAPI();

  }, []);

  return (
    <div className="App">
      <Navbar/>

      <List>
        {
          activities.map(activity => 
            <List.Item key={activity.id} >{activity.name}</List.Item>
          )
        }
      </List>
    </div>
  );
}

export default App;
