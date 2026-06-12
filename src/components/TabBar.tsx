import styles from './TabBar.module.css';

const tabs: [string, string][] = [
  ['plan', 'Workout Plan'],
  ['progress', 'Progress'],
  ['prehab', 'Knee & Foot Care'],
  ['tips', 'Tips & Strategy'],
];

interface TabBarProps {
  activeTab: string;
  accentColor: string;
  onTabChange: (tab: string) => void;
}

export default function TabBar({ activeTab, accentColor, onTabChange }: TabBarProps) {
  return (
    <div className={styles.tabBar}>
      {tabs.map(([id, label]) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`${styles.tab} ${activeTab === id ? styles.active : ''}`}
          style={{
            borderBottomColor: activeTab === id ? accentColor : 'transparent',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
