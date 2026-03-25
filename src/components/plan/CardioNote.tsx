import type { Day } from '../../types';
import styles from './CardioNote.module.css';

interface CardioNoteProps {
  day: Day;
}

export default function CardioNote({ day }: CardioNoteProps) {
  return (
    <div className={styles.cardio} style={{ borderColor: `${day.color}33` }}>
      <div className={styles.label} style={{ color: day.accent }}>
        Post-Workout Cardio
      </div>
      <p className={styles.text}>{day.cardio}</p>
    </div>
  );
}
