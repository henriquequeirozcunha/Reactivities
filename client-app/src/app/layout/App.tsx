import React, { useEffect, useState, Fragment } from "react";

import { Container } from "semantic-ui-react";
import "./styles.css";

import axios from "axios";
import { IActivity } from "../models/Activity";
import { Navbar } from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

function App() {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null >(null);

  const [editMode, setEditMode] = useState(false);

  const handleSetSelectedActivity = (id : String) => {
    setSelectedActivity(activities.filter(obj => obj.id === id)[0]);
    setEditMode(false);

  }

  const handleOpenCreateForm = () => {
      setSelectedActivity(null);
      setEditMode(true);
  }

  const handleCreateActivity = (activity : IActivity) => {
    setActivities([...activities, activity ]);
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleEditActivity = (activity : IActivity) => {
    setActivities([...activities.filter(a => a.id !== activity.id), activity ]);
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleDeleteActivity = (id : string) => {
    setActivities([...activities.filter(a => a.id !== id)]);
    
  }


  useEffect(() => {
    async function getValuesFromAPI() {
      const response = await axios.get<IActivity[]>(
        "http://localhost:5000/api/activities"
      );
      let activities : IActivity[] = [];

      response.data.forEach(activity => {
        activity.date = activity.date.split('.')[0];
        activities.push(activity);
      })

      setActivities(activities);
    }

    getValuesFromAPI();
  }, []);

  return (
    <Fragment>
      <Navbar openCreateForm = {handleOpenCreateForm}/>
      <Container className="container-list">
        <ActivityDashboard 
        activities={activities} 
        selectActivity = {handleSetSelectedActivity}
        activity = {selectedActivity}
        editMode = {editMode}
        setEditMode = {setEditMode}
        setSelectedActivity = {setSelectedActivity}
        createActivity = {handleCreateActivity}
        editActivity = {handleEditActivity}
        deleteActivity = {handleDeleteActivity}
        />
      </Container>
    </Fragment>
  );
}

export default App;
