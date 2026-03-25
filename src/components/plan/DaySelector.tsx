import { days } from '../../data/exercises';
import styles from './DaySelector.module.css';

interface DaySelectorProps {
  activeDay: number;
  onDayChange: (day: number) => void;
}

export default function DaySelector({ activeDay, onDayChange }: DaySelectorProps) {
  return (
    <div className={styles.selector}>
      {days.map((d, i) => (
        <button
          key={i}
          onClick={() => onDayChange(i)}
          className={`${styles.btn} ${activeDay === i ? styles.active : ''}`}
          style={{
            background: activeDay === i ? d.color : undefined,
            boxShadow: activeDay === i ? `0 4px 20px ${d.color}55` : undefined,
          }}
        >
          <div className={styles.label}>{d.label}</div>
          {d.name}
        </button>
      ))}
    </div>
  );
}
