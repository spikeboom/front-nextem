import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './TaskForm.css';

const TaskForm = props => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      description: {
        value: '',
        isValid: false
      },
      taskmaster: {
        value: '',
        isValid: false
      },
      type: {
        value: '',
        isValid: false
      },
      date: {
        value: null,
        isValid: false
      }
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async event => {
    event.preventDefault();
    try {
      let formData = {
        description: formState.inputs.description.value,
        taskmaster: formState.inputs.taskmaster.value,
        type: formState.inputs.type.value,
        deadline: formState.inputs.date.value,
        userData: {
          userId: auth.userId
        }
      }
      formData = JSON.stringify(formData);
      await sendRequest('https://back-mern-nextem.herokuapp.com/api/tasks', 'POST', formData, {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + auth.token
      });
      history.push('/');
      props.onAdd();
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="description"
          element="input"
          type="text"
          label="Atividade"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description."
          onInput={inputHandler}
        />
        <Input
          id="taskmaster"
          element="select"
          dataSelect={props.dataInit.taskmasters}
          label="Responsável"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid taskmaster."
          onInput={inputHandler}
        />
        <Input
          id="type"
          element="select"
          dataSelect={props.dataInit.types}
          label="Status"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid status."
          onInput={inputHandler}
        />
        <Input
          id="date"
          element="input"
          type="date"
          label="Deadline"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid deadline."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          Adicionar tarefa
        </Button>
      </form>
    </React.Fragment>
  );
};

export default TaskForm;
