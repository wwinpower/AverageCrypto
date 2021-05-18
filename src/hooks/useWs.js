import { useEffect, useRef } from "react";

import { WS_URL } from '../utils/constants';

export const useWs = () => {
  const wsRef = useRef(new WebSocket(WS_URL));
  
  useEffect(() => () => wsRef.current.close(), []);

  return wsRef.current;
};
