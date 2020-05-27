import React, { Fragment, useContext, useEffect } from "react";

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
import { RootStoreContext } from "../stores/rootStore";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../commom/modals/ModalContainer";
import ProfilePage from "../../features/profiles/ProfilePage";

const App: React.FC<RouteComponentProps> = ({ location }) => {

  const rootStore = useContext(RootStoreContext);
  
  const { setAppLoaded, token, appLoaded } = rootStore.commomStore;

  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if(token){
      getUser().finally(() => setAppLoaded());
    }
    else {
        setAppLoaded();
    }
  }, [getUser, setAppLoaded, token]);

  if(!appLoaded) return (<LoadingComponent content='Loading app...' inverted={true}/>)

  return (
    <Fragment>
      <ModalContainer  />
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
                <Route path='/profile/:username' component={ProfilePage} />
                
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
