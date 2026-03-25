import type { Day } from '../../types';
import styles from './DayHeader.module.css';

interface DayHeaderProps {
  day: Day;
  progress: number;
  doneSets: number;
  totalSets: number;
}

export default function DayHeader({ day, progress, doneSets, totalSets }: DayHeaderProps) {
  return (
    <div
      className={styles.header}
      style={{
        background: `linear-gradient(135deg, ${day.color}22, ${day.color}08)`,
        borderColor: `${day.color}33`,
      }}
    >
      <div className={styles.top}>
        <div>
          <h2 className={styles.name} style={{ color: day.accent }}>
            {day.name}
          </h2>
          <p className={styles.subtitle}>{day.subtitle}</p>
        </div>
        <div className={styles.progressWrap}>
          <div className={styles.progressLabel}>Progress</div>
          <div className={styles.progressValue} style={{ color: day.color }}>
            {progress}%
          </div>
        </div>
      </div>
      <div className={styles.bar}>
        <div
          className={styles.barFill}
          style={{ width: `${progress}%`, background: day.color }}
        />
      </div>
      <div className={styles.setCount}>
        {doneSets} / {totalSets} sets completed
      </div>
    </div>
  );
}
