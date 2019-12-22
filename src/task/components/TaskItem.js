import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './TaskItem.css';

const UserItem = props => {
  const { error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `https://back-mern-nextem.herokuapp.com/api/tasks/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onFinishDeleteTask();
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this task? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="user-item">
        <Card className="user-item__content">
          <Link onClick={(showDeleteWarningHandler)} to={`/`}>
            <div className="user-item__info">
              <h2>{props.description}</h2>
              <h3>{props.taskmaster}</h3>
              <h3>{props.type}</h3>
              <h3>{props.deadline.slice(0,10)}</h3>
            </div>
          </Link>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default UserItem;
