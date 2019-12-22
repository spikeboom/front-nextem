import React, { useState, useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-context';

import './Questions.css';

const Questions = () => {
  const [mseconds, setMseconds] = useState(500);
  const auth = useContext(AuthContext);

  function timeoutPromise(ms, promise) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const timeoutId = setTimeout(() => {
        reject(new Error("promise timeout"))
      }, ms);
      promise.then(
        (res) => {
          const time = Date.now() - start;
          clearTimeout(timeoutId);
          resolve(time);
        },
        (err) => {
          clearTimeout(timeoutId);
          reject(err);
        }
      );
    })
  }

  const sendRequestToApi = async () => {
    let objResponse = {};
    try {
      if (auth.token) {
        const response = await timeoutPromise(mseconds, 
          fetch(
            'https://back-mern-nextem.herokuapp.com/api/tasks/init', {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + auth.token
            },
            timeout: mseconds
          })
        );
        objResponse = { time: response, fromApi: true }
      }
    } catch (err) {
      objResponse =  { timeout: true };
    }
    alert(JSON.stringify(objResponse));
  };

  const handleChange = event => {
    setMseconds(event.target.value);
  }

  const handleSubmit = event => {
    sendRequestToApi();
    event.preventDefault();
  }

  return (
    <div className="questions">
      <h3>Questão 3 - sendRequestToApi</h3>
      <form onSubmit={handleSubmit}>
        <span>MiliSeconds</span>
        <input type="text" value={mseconds} onChange={handleChange}></input>
        <input type="submit" value="Request" />
      </form>
    </div>
  );
};

export default Questions;
