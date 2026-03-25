import { gymPrehab, dailyFootRoutine, prehabTimeline } from '../../data/exercises';
import PrehabCard from './PrehabCard';
import Timeline from './Timeline';
import styles from './PrehabTab.module.css';

export default function PrehabTab() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Knee &amp; Foot Care</h2>
      <p className={styles.intro}>
        Your flat feet and knee history are connected &mdash; collapsed arches cause ankle pronation
        which forces your knees to track inward. This routine fixes the root cause. Do the{' '}
        <strong className={styles.highlight}>gym prehab</strong> before Wednesday &amp; Saturday
        workouts, and the <strong className={styles.highlight}>daily foot routine</strong> at home
        any time &mdash; even watching TV.
      </p>

      {/* Gym Prehab */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBar} style={{ background: '#3ACA6E' }} />
          <h3 className={styles.sectionTitle}>Gym Prehab &middot; Wed &amp; Sat (before lifting)</h3>
        </div>
        <p className={styles.sectionSubtitle}>
          ~2 minutes. Do this immediately after your cardio warmup, before stretching.
        </p>
        <div className={styles.cards}>
          {gymPrehab.map((ex, i) => (
            <PrehabCard key={i} exercise={ex} accentColor="#5df094" />
          ))}
        </div>
      </div>

      {/* Squat Tip */}
      <div className={styles.tip}>
        <div className={styles.tipLabel}>Squat &amp; Split Squat Tip</div>
        <p className={styles.tipText}>
          Place a <strong className={styles.highlight}>5&ndash;10 lb plate under your heels</strong>{' '}
          for squats and Bulgarian split squats. Flat feet often cause limited ankle dorsiflexion,
          which forces your knees forward and your torso to lean. Heel elevation instantly fixes your
          depth and knee tracking. As your arches strengthen over 2&ndash;3 months, gradually reduce
          the plate size.
        </p>
      </div>

      {/* Daily Foot Routine */}
      <div>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBar} style={{ background: '#E8A83A' }} />
          <h3 className={styles.sectionTitle}>Daily Foot Routine &middot; ~5 min, any time</h3>
        </div>
        <p className={styles.sectionSubtitle}>
          No equipment. Do this at home &mdash; watching TV, morning, evening, whenever. Results in
          6&ndash;8 weeks of daily practice.
        </p>
        <div className={styles.cards}>
          {dailyFootRoutine.map((ex, i) => (
            <PrehabCard key={i} exercise={ex} accentColor="#ffc95c" />
          ))}
        </div>
      </div>

      <Timeline entries={prehabTimeline} />
    </div>
  );
}
