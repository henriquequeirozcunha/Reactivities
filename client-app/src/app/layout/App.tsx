import React, { Fragment } from "react";

import { Container } from "semantic-ui-react";
import "./styles.css";

import { Navbar } from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

import { observer } from "mobx-react-lite";
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import HomePage from "../../features/home/homePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import {ToastContainer} from 'react-toastify';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Fragment>
      <ToastContainer position='bottom-right' />
      <Route path="/" exact component={HomePage} />

      <Route
        path="/(.+)"
        render={() => (
          <Fragment>
            <Navbar />
            <Container className="container-list">
              <Switch>
                <Route path="/activities" exact component={ActivityDashboard} />
                <Route
                  path="/activities/:id"
                  exact
                  component={ActivityDetails}
                />
                <Route
                  key={location.key}
                  path={["/createActivity", "/manage/:id"]}
                  exact
                  component={ActivityForm}
                />

                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
