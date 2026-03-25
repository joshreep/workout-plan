import { schedule } from '../../data/exercises';
import styles from './WeeklySchedule.module.css';

export default function WeeklySchedule() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Weekly Schedule</h3>
      <div className={styles.list}>
        {schedule.map((row, i) => (
          <div
            key={i}
            className={styles.row}
            style={{ opacity: row.rest ? 0.5 : 1 }}
          >
            <div
              className={styles.bar}
              style={{ background: row.color }}
            />
            <div>
              <div className={styles.day}>{row.day}</div>
              <div className={styles.plan}>{row.plan}</div>
            </div>
            {row.rest && <div className={styles.restLabel}>REST</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
