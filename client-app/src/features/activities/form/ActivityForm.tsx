import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/commom/form/textInput";
import TextAreaInput from "../../../app/commom/form/TextAreaInput";
import SelectInput from "../../../app/commom/form/SelectInput";
import { category } from "../../../app/commom/options/categoryOptions";
import DateInput from "../../../app/commom/form/DateInput";
import {ActivityFormValues} from "../../../app/models/Activity";
import { combineDateAndTime } from "../../../app/commom/util/util";
import {combineValidators, isRequired, composeValidators, hasLengthGreaterThan} from 'revalidate';


interface DetailParams {
  id: string;
}

const validate = combineValidators({
  title : isRequired({message: 'Title is required'}),
  category : isRequired({message: 'Category is required'}),
  description : composeValidators(
    isRequired({message: 'Description is required'}),
    hasLengthGreaterThan(4)({message: 'Decription must be grater than 4'})
  )(),
  city : isRequired({message: 'City is required'}),
  venue : isRequired({message: 'Venue is required'}),
  date : isRequired({message: 'Date is required'}),
  time : isRequired({message: 'Time is required'}),
  
})

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);

  const {
    submitting,
    loadActivity,
    createActivity,
    editActivity
  } = activityStore;

  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then((activity) => setActivity(new ActivityFormValues(activity)))
        .finally(() => setLoading(false));
    }
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;

    activity.date = dateAndTime;

      if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };

      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  component={TextInput}
                  name="title"
                  placeholder="Title"
                  value={activity?.title}
                />
                <Field
                  component={TextAreaInput}
                  rows={3}
                  placeholder="Description"
                  name="description"
                  value={activity?.description}
                />
                <Field
                  component={SelectInput}
                  options={category}
                  placeholder="Category"
                  name="category"
                  value={activity?.category}
                />
                <Form.Group widths="equal">
                  <Field<Date>
                    component={DateInput}
                    placeholder="Date"
                    name="date"
                    date={true}
                    value={activity?.date!}
                  />
                  <Field<Date>
                    component={DateInput}
                    placeholder="time"
                    name="time"
                    time={true}
                    value={activity?.date!}
                  />
                </Form.Group>
                <Field
                  component={TextInput}
                  placeholder="City"
                  name="city"
                  value={activity?.city}
                />
                <Field
                  component={TextInput}
                  placeholder="Venue"
                  name="venue"
                  value={activity?.venue}
                />

                <Button
                  floated="right"
                  loading={submitting}
                  disabled={loading || invalid || pristine}
                  positive
                  type="submit"
                  content="Submit"
                ></Button>
                <Button
                  disabled={loading  }
                  onClick={
                    activity.id
                      ? () => history.push(`/activities/${activity.id}`)
                      : () => history.push("/activities")
                  }
                  type="button"
                  floated="right"
                  content="Cancel"
                ></Button>
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
