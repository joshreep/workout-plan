import type { PrehabExercise } from '../../types';
import styles from './PrehabCard.module.css';

interface PrehabCardProps {
  exercise: PrehabExercise;
  accentColor: string;
}

export default function PrehabCard({ exercise: ex, accentColor }: PrehabCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.inner}>
        <div className={styles.icon}>{ex.icon}</div>
        <div className={styles.content}>
          <div className={styles.name}>{ex.name}</div>
          <div className={styles.sets} style={{ color: ex.color ?? accentColor }}>
            {ex.sets}
          </div>
          <div className={styles.notes}>{ex.notes}</div>
          <a
            href={ex.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.videoLink}
            style={{ borderColor: `${accentColor}44`, color: accentColor }}
          >
            &#9654; Watch Tutorial
          </a>
        </div>
      </div>
    </div>
  );
}
