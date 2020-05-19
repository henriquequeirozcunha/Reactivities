import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button, Header } from "semantic-ui-react";
import TextInput from "../../app/commom/form/textInput";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IUserFormValues } from "../../app/models/User";
import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";
import ErrorMessage from "../../app/commom/form/ErrorMessage";


const validate = combineValidators({
  username: isRequired("username"),
  displayname: isRequired("displayname"),
  email: isRequired("email"),
  password: isRequired("password"),

});

const RegisterForm = () => {
  const rootStore = useContext(RootStoreContext);

  const { register } = rootStore.userStore;

  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        register(values).catch((error) => ({
          [FORM_ERROR]: error,
        }))
      }
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        form,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            as="h2"
            content="Sign Up to Reactivities"
            color="teal"
            textAlign="center"
          />

          <Field name="username" component={TextInput} placeholder="User Name" />
          <Field name="displayname" component={TextInput} placeholder="Display Name" />
          <Field name="email" component={TextInput} placeholder="email" />

          

          <Field
            name="password"
            component={TextInput}
            placeholder="password"
            type="password"
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage 
              error={submitError} 
              text = {JSON.stringify(submitError.errors)} />
          )}
          
          <Button
            disabled={(invalid && dirtySinceLastSubmit) || pristine}
            color='teal'
            loading={submitting}
            content="Register"
            fluid
          />
          
        </Form>
      )}
    />
  );
};

export default RegisterForm;
