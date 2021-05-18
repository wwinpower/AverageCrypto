import React, { useCallback, useState } from "react";
import { useWs, useWsOnMessage } from "../../hooks/";
import classes from "./Statistics..module.scss";

const Statistics = () => {
  const [data, setData] = useState([]);
  const [deviationAvg, setDeviationAvg] = useState(0);
  const [deviationAvgStandart, setDeviationAvgStandart] = useState(0);
  const [disabled, setDisabled] = useState(true);

  const socket = useWs();

  const onMessage = useWsOnMessage({ setData });

  const getAverage = useCallback(
    (data) =>
      data.reduce((sum, elm) => sum + (elm?.value || elm), 0) / data.length,
    []
  );

  const standardDeviation = useCallback((data) => {
    let squareDiffs = data.map((elm) => (elm.value - deviationAvg) ** 2);

    return Math.sqrt(getAverage(squareDiffs));
  }, []);

  const handlerClickStart = () => {
    socket.addEventListener("open", console.log("Соединение установлено !"));
    socket.addEventListener("message", onMessage);

    setDisabled(false);
  };

  const handlerClickStop = () => {
    if(data.length > 0){
      setDeviationAvg(getAverage(data));
      setDeviationAvgStandart(standardDeviation(data));
    }
  };

  return (
    <div className={classes.container}>
      <button onClick={handlerClickStart}>Старт</button>
      <button onClick={handlerClickStop} disabled={disabled}>
        Статистика
      </button>

      <div>
        <p>Среднее: {deviationAvg || 0}</p>
        <p>Стандартное отклонение: {deviationAvgStandart || 0}</p>
      </div>
    </div>
  );
};

export default Statistics;
