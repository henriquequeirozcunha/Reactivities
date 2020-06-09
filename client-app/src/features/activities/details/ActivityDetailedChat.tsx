import React, { Fragment, useContext, useEffect } from "react";
import { Segment, Header, Form, Button, Comment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { Form as FinalForm, Field } from "react-final-form";
import { Link } from "react-router-dom";
import TextAreaInput from "../../../app/commom/form/TextAreaInput";
import { formatDistance } from "date-fns/esm";
import { IActivity } from "../../../app/models/Activity";

interface IProps {
  activity : IActivity | null;
}


const ActivityDetailedChat : React.FC<IProps> = ({activity}) => {
  const rootStore = useContext(RootStoreContext);

  const {
    createHubConnection,
    stopHubConnection,
    addComment,
  } = rootStore.activityStore;

  useEffect(() => {
    
    if(activity != null){
      console.log(activity);
      createHubConnection(activity!.id);
    }

    return () => {
      stopHubConnection();
    };
  }, [createHubConnection, stopHubConnection, activity]);

  return (
    <Fragment>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached>
        <Comment.Group>
          {activity &&
            activity.comments &&
            activity.comments.map((comment) => (
              <Comment key={comment.id}>
                <Comment.Avatar src={comment.image || "/assets/user.png"} />
                <Comment.Content>
                  <Comment.Author as={Link} to={`/profile/${comment.username}`}>
                    {comment.displayName}
                  </Comment.Author>
                  <Comment.Metadata>
                    <div>{ formatDistance(comment.createdDate, new Date())}</div>
                  </Comment.Metadata>
                  <Comment.Text>{comment.body}</Comment.Text>
                </Comment.Content>
              </Comment>
            ))}
            

          <FinalForm
            onSubmit={addComment}
            render={({ handleSubmit, submitting, form }) => (
              <Form onSubmit={() => { handleSubmit()?.then(() => form.reset()) }}>
                <Field 
                 name='body'
                 component={TextAreaInput}
                 rows={2}
                 placeholder= 'Add your comment' />
                <Button
                  content="Add Reply"
                  labelPosition="left"
                  icon="edit"
                  primary
                  loading={submitting}
                />
              </Form>
            )}
          />
        </Comment.Group>
      </Segment>
    </Fragment>
  );
};

export default observer(ActivityDetailedChat);
