import React from 'react';

import TaskItem from './TaskItem';
import Card from '../../shared/components/UIElements/Card';
import './TaskList.css';

const TaskList = props => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No tasks found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {props.items.map(task => (
        <TaskItem
          key={task._id}
          id={task._id}
          description={task.description}
          taskmaster={task.taskmaster.name}
          type={task.type.name}
          deadline={task.deadline}
          onFinishDeleteTask={props.onFinishDeleteTask}
        />
      ))}
    </ul>
  );
};

export default TaskList;
