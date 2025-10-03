import styles from './styles.module.scss';

type ITimer = {
  time: number
}

function Timer({time}: ITimer) {
  return (
    <div className={styles.timer}>
      <span className={styles.digits}>
        {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
      </span>
      <span className={styles.digits}>
        {("0" + Math.floor((time / 1000) % 60)).slice(-2)}:
      </span>
      <span className={`${styles.digits} ${styles.miliSec}`}>
        {("0" + ((time / 10) % 100)).slice(-2)}
      </span>
    </div>
  )
}

export default Timer;