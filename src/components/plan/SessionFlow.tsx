import styles from './SessionFlow.module.css';

const steps = ['2 min warmup', '5 min stretch', '~30 min lift', '5\u201310 min cardio'];

export default function SessionFlow() {
  return (
    <div className={styles.flow}>
      {steps.map((s, i) => (
        <span key={i} className={styles.stepWrap}>
          <span className={styles.step}>{s}</span>
          {i < steps.length - 1 && <span className={styles.arrow}>&rarr;</span>}
        </span>
      ))}
    </div>
  );
}
