import { useRef } from "react";

const useLongTouch = <T>(
  callback: (e: React.TouchEvent<T>, ...args: any[]) => any
) => {
  const ref = useRef(0);
  const onTouchStart = (e: React.TouchEvent<T>) => {
    ref.current = e.timeStamp;
  };
  const onTouchEnd = (e: React.TouchEvent<T>, ...args: any[]) => {
    if (ref.current + 800 < e.timeStamp) {
      callback(e, ...args);
    }
    ref.current = 0;
  };

  return {
    onTouchStart,
    onTouchEnd,
  };
};

export default useLongTouch;
