import styles from "./styles.module.scss";

type IProps = {
  isPaused: boolean;
  isActive: boolean;
  handleStart: () => void;
  handleReset: () => void;
  handlePauseResume: () => void;
};

function ControlButtons({
  isPaused,
  isActive,
  handleStart,
  handleReset,
  handlePauseResume,
}: IProps) {
  const StartButton = (
    <div
      className={`${styles.btn} ${styles.btnOne} ${styles.btnStart}`}
      onClick={handleStart}
    >
      Start
    </div>
  );
  const ActiveButtons = (
    <div className={`${styles.btnGrp}`}>
      <div className={`${styles.btn} ${styles.btnTwo}`} onClick={handleReset}>
        Reset
      </div>
      <div
        className={`${styles.btn} ${styles.One}`}
        onClick={handlePauseResume}
      >
        {isPaused ? "Resume" : "Pause"}
      </div>
    </div>
  );

  return (
    <div className={`${styles.ControlButtons}`}>
      <div>{isActive ? ActiveButtons : StartButton}</div>
    </div>
  );
}

export default ControlButtons;
