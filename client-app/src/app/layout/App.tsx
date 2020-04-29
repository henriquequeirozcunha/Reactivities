import React, { useEffect, Fragment, useContext } from "react";

import { Container } from "semantic-ui-react";
import "./styles.css";


import { Navbar } from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import ActivityStore from '../stores/activityStore';
import {observer} from 'mobx-react-lite';


const  App = () => {
  const activityStore = useContext(ActivityStore);
  useEffect(() => {
      activityStore.loadActivities();
  }, [activityStore]);


  if(activityStore.loadingInitial) return <LoadingComponent content='Loading Activities' inverted={true} />

  return (
    <Fragment>
      <Navbar/>
      <Container className="container-list">
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
}

export default  observer(App);
