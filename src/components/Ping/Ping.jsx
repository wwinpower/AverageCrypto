import React, { useCallback, useState } from "react";
import axios from "axios";
import classes from "./Ping.module.scss";

// Address                  - поле для урла
// Requests to make         - количество запросов, которое мы хотим сделать
// Average response time    - среднее время пинга
// Requests made            - счетчик сделаных реквестов
// disabled                 - для кнопки

const Ping = () => {
  const [address, setAddress] = useState("google.com");
  const [requestsToMake, setrRquestsToMake] = useState(1);
  const [requestsMade, setRequestsMade] = useState(null);
  const [averageResponseTime, setAverageResponseTime] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const handleRequsetsChange = (event) => {
    let requestsToMake = event.currentTarget.valueAsNumber;
    requestsToMake = requestsToMake || 0;
    requestsToMake = Math.min(requestsToMake, 500);
    requestsToMake = Math.max(requestsToMake, 0);

    setrRquestsToMake(requestsToMake);
  };

  const getAverage = useCallback(
    (data) =>
      data.reduce((sum, elm) => sum + (elm?.value || elm), 0) / data.length,
    []
  );

  const handlerRequestStart = useCallback(async () => {
    let average = [];

    setRequestsMade(null);
    setDisabled(true);

    for (let i = 0; i < requestsToMake; i++) {
      let time1 = performance.now();
      await axios
        .get(address)
        .then(() => setRequestsMade((prevState) => prevState + 1));
      let time2 = performance.now();

      average.push(time2 - time1);
    }

    average = getAverage(average);

    setAverageResponseTime(average);
    setDisabled(false);
  }, []);

  return (
    <>
      <div className={classes.form}>
        <div className={classes.form__item}>
          <label>Address: </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.currentTarget.value)}
          />
        </div>
        <div className={classes.form__item}>
          <label>Requests to make: </label>
          <input
            type="number"
            value={requestsToMake}
            onChange={handleRequsetsChange}
          />
        </div>
        <div className={classes.form__item}>
          <label>Average response time: </label>
          <b>{averageResponseTime} </b>
        </div>
        <div className={classes.form__item}>
          <label>Requests made:</label>
          <b>
            {requestsMade} of {requestsToMake}
          </b>
        </div>
        <div className={classes.form__item}>
          <button onClick={handlerRequestStart} disabled={disabled}>
            Start!
          </button>
        </div>
      </div>
    </>
  );
};

export default Ping;
