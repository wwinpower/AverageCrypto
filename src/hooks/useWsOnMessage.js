import { useCallback } from "react";

export const useWsOnMessage = ({ setData }) => {

  return useCallback((event) => {

      const data = JSON.parse(event.data);

      setData(prevState => [...prevState, data]);  

  }, [setData]);
};
