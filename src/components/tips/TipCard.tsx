import type { Tip } from '../../types';
import styles from './TipCard.module.css';

interface TipCardProps {
  tip: Tip;
}

export default function TipCard({ tip }: TipCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{tip.icon}</div>
      <div>
        <div className={styles.title}>{tip.title}</div>
        <div className={styles.body}>{tip.body}</div>
      </div>
    </div>
  );
}
