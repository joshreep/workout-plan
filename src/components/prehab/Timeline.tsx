import type { TimelineEntry } from '../../types';
import styles from './Timeline.module.css';

interface TimelineProps {
  entries: TimelineEntry[];
}

export default function Timeline({ entries }: TimelineProps) {
  return (
    <div className={styles.timeline}>
      <div className={styles.label}>What to expect</div>
      {entries.map((row, i) => (
        <div key={i} className={styles.row} style={{ marginBottom: i < entries.length - 1 ? 10 : 0 }}>
          <div className={styles.week}>{row.week}</div>
          <div className={styles.note}>{row.note}</div>
        </div>
      ))}
    </div>
  );
}
