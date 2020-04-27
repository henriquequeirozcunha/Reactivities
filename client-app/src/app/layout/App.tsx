import React, { useEffect, useState, Fragment, SyntheticEvent } from "react";

import { Container } from "semantic-ui-react";
import "./styles.css";

import axios from "axios";
import { IActivity } from "../models/Activity";
import { Navbar } from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null >(null);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');

  const handleSetSelectedActivity = (id : String) => {
    setSelectedActivity(activities.filter(obj => obj.id === id)[0]);
    setEditMode(false);

  }

  const handleOpenCreateForm = () => {
      setSelectedActivity(null);
      setEditMode(true);
  }

  const handleCreateActivity = async (activity : IActivity) => {
    setSubmitting(true);
    const response = await agent.Activities.create(activity);
    setSubmitting(false);

    setActivities([...activities, activity ]);
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleEditActivity = async (activity : IActivity) => {
    setSubmitting(true);
    const response = await agent.Activities.update(activity);
    setSubmitting(false);

    setActivities([...activities.filter(a => a.id !== activity.id), activity ]);
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleDeleteActivity = async ( event : SyntheticEvent<HTMLButtonElement> ,id : string) => {
    setTarget(event.currentTarget.name);
    setSubmitting(true);
    const response = await agent.Activities.delete(id);
    setSubmitting(false);

    setActivities([...activities.filter(a => a.id !== id)]);
    
  }


  useEffect(() => {
    async function getValuesFromAPI() {
      setSubmitting(true);
      const response = await agent.Activities.list();
      setSubmitting(false);


      let activities : IActivity[] = [];

      response.forEach(activity => {
        activity.date = activity.date.split('.')[0];
        activities.push(activity);
      })

      setActivities(activities);
      setLoading(false);
    }

    getValuesFromAPI();
  }, []);


  if(loading) return <LoadingComponent content='Loading Activities' inverted={true} />

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
        submitting = {submitting}
        target = {target}
        />
      </Container>
    </Fragment>
  );
}

export default App;
