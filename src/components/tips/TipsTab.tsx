import { tips } from '../../data/exercises';
import TipCard from './TipCard';
import WeeklySchedule from './WeeklySchedule';
import styles from './TipsTab.module.css';

export default function TipsTab() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Strategy &amp; Tips</h2>
      <p className={styles.intro}>
        Going from ~22% &rarr; 12% body fat while building muscle takes roughly{' '}
        <strong className={styles.highlight}>6&ndash;12 months</strong> of consistent effort.
        Here&rsquo;s what actually moves the needle:
      </p>
      <div className={styles.cards}>
        {tips.map((tip, i) => (
          <TipCard key={i} tip={tip} />
        ))}
      </div>
      <WeeklySchedule />
    </div>
  );
}
