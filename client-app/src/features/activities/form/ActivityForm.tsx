import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";

import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";


interface DetailParams {
  id : string
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) => {
  const activityStore = useContext(ActivityStore);

  const {
    createActivity,
    editActivity,
    submitting,
    activity: initialActivity,
    loadActivity,
    clearActivity
  } = activityStore;



  const [activity, setActivity] = useState({
    id: "",
    name: "",
    title: "",
    description: "",
    category: "",
    date: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    if(match.params.id && activity.id.length === 0){
      loadActivity(match.params.id).then(() => {
        initialActivity && setActivity(initialActivity);
      });
    }


    return () => {
      clearActivity();
    }

  }, [loadActivity, clearActivity, match.params.id, initialActivity, activity.id.length]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };

      createActivity(newActivity).then(() => {
        history.push('/activities');
      });
    } else {
      editActivity(activity).then(() => {
        history.push('/activities');
      });
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;

    setActivity({ ...activity, [name]: value });
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          onChange={handleInputChange}
          placeholder="Title"
          name="title"
          value={activity?.title}
        />
        <Form.TextArea
          onChange={handleInputChange}
          rows={2}
          placeholder="Description"
          name="description"
          value={activity?.description}
        />
        <Form.Input
          onChange={handleInputChange}
          placeholder="Category"
          name="category"
          value={activity?.category}
        />
        <Form.Input
          onChange={handleInputChange}
          type="datetime-local"
          placeholder="Date"
          name="date"
          value={activity?.date}
        />
        <Form.Input
          onChange={handleInputChange}
          placeholder="City"
          name="city"
          value={activity?.city}
        />
        <Form.Input
          placeholder="Venue"
          name="venue"
          onChange={handleInputChange}
          value={activity?.venue}
        />

        <Button
          floated="right"
          loading={submitting}
          positive
          type="submit"
          content="Submit"
        ></Button>
        <Button
          onClick={() => { history.push('/activities')}}
          type='button'
          floated="right"
          content="Cancel"
        ></Button>
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
