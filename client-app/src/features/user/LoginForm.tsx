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
  email: isRequired("email"),
  password: isRequired("password"),
});

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);

  const { login } = rootStore.userStore;

  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        login(values).catch((error) => ({
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
            content="Login to Reactivities"
            color="teal"
            textAlign="center"
          />
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
              text = 'Invalid Email or PassWord' />
          )}
          
          <Button
            disabled={(invalid && dirtySinceLastSubmit) || pristine}
            color='teal'
            loading={submitting}
            content="Login"
            fluid
          />
          
        </Form>
      )}
    />
  );
};

export default LoginForm;
