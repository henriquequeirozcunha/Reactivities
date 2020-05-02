import React, { Fragment } from "react";

import { Container } from "semantic-ui-react";
import "./styles.css";

import { Navbar } from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

import { observer } from "mobx-react-lite";
import { Route, withRouter, RouteComponentProps } from "react-router-dom";
import HomePage from "../../features/home/homePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  
  return (
    <Fragment>
      <Route path="/" exact component={HomePage} />

      <Route
        path="/(.+)"
        render={() => (
          <Fragment>
            <Navbar />
            <Container className="container-list">
              <Route path="/activities" exact component={ActivityDashboard} />
              <Route path="/activities/:id" exact component={ActivityDetails} />
              <Route
                key={location.key}
                path={["/createActivity", "/manage/:id"]}
                exact
                component={ActivityForm}
              />
              {/* <ActivityDashboard /> */}
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
