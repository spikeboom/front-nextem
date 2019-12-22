import React, { useEffect, useState, useContext } from 'react';

import TasksList from '../components/TasksList';
import TaskForm from '../components/TaskForm';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const Tasks = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedTasks, setLoadedTasks] = useState();

  const fetchInit = async () => {
    try {
      if (auth.token) {
        const responseData = await sendRequest(
            'https://back-mern-nextem.herokuapp.com/api/tasks/init', 'GET', null, {
            Authorization: 'Bearer ' + auth.token
        });
        setLoadedTasks(responseData);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchInit();
  }, [sendRequest, auth.token]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedTasks && <TaskForm dataInit={loadedTasks} onAdd={fetchInit}/>}
      {!isLoading && loadedTasks && <TasksList items={loadedTasks.tasks} 
        onFinishDeleteTask={fetchInit}/>}
    </React.Fragment>
  );
};

export default Tasks;
