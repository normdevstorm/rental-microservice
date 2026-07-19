import { useEffect, useState } from "react";
import ControlButtons from "../ControlButtons";
import Timer from "../Timer";
import styles from "./styles.module.scss";
import withAuth from "../WithAuth";

function StopWatch() {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: any = null;

    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  return (
    <div className={styles.center}>
      <div className={styles.stopWatch}>
        <Timer time={time} />
        <ControlButtons
          isActive={isActive}
          isPaused={isPaused}
          handleStart={handleStart}
          handlePauseResume={handlePauseResume}
          handleReset={handleReset}
        />
      </div>
    </div>
  );
}

export default withAuth(StopWatch);
