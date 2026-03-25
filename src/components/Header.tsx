import styles from './Header.module.css';

interface HeaderProps {
  storageReady: boolean;
}

export default function Header({ storageReady }: HeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.label}>5-Day Program &middot; Recomposition</div>
        <h1 className={styles.title}>Your Training Plan</h1>
        <p className={styles.subtitle}>
          35 y/o &middot; ~20&ndash;25% BF &rarr; 12% target &middot; Mon&ndash;Thu + Sat &middot;
          ~30 min sessions
          {storageReady && <span className={styles.saved}>&bull; Saved</span>}
        </p>
      </div>
    </div>
  );
}
