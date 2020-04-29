import React, { useState, FormEvent, useContext } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/Activity";
import ActivityStore from '../../../app/stores/activityStore';

import {v4 as uuid} from 'uuid';
import { observer } from "mobx-react-lite";

interface IProps {
  activity: IActivity | undefined;
}

const ActivityForm: React.FC<IProps> = ({
  activity: initialActivity
  
}) => {

  const activityStore = useContext(ActivityStore);

  const {createActivity, editActivity, submitting, cancelFormOpen} = activityStore;

  const initializeForm = () => {
    if (initialActivity) {
      return initialActivity;
    } else {
      const activityEmpty: IActivity = {
        id: "",
        name: "",
        title: "",
        description: "",
        category: "",
        date: "",
        city: "",
        venue: "",
      };

      return activityEmpty;
    }
  };
  const [activity, setActivity] = useState(initializeForm);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if(activity.id.length === 0){
      let newActivity = {
        ...activity, 
        id: uuid()
      }

      createActivity(newActivity);
    }
    else{
      editActivity(activity);
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
          onClick={cancelFormOpen}
          floated="right"
          content="Cancel"
        ></Button>
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
