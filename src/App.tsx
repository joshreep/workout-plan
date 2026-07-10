import { useState } from 'react';
import { days } from './data/exercises';
import { useWorkoutLog } from './hooks/useWorkoutLog';
import Header from './components/Header';
import TabBar from './components/TabBar';
import SessionFlow from './components/plan/SessionFlow';
import DaySelector from './components/plan/DaySelector';
import DayHeader from './components/plan/DayHeader';
import ExerciseCard from './components/plan/ExerciseCard';
import CardioNote from './components/plan/CardioNote';
import ProgressTab from './components/progress/ProgressTab';
import PrehabTab from './components/prehab/PrehabTab';
import TipsTab from './components/tips/TipsTab';

export default function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [tab, setTab] = useState('plan');

  const day = days[activeDay];
  const {
    storageReady,
    log,
    isSetDone,
    lastEntry,
    getDraft,
    updateDraft,
    getMovDraft,
    updateMovDraft,
    lastMovEntry,
    logSet,
    uneditSet,
    totalSets,
    doneSets,
    progress,
    setKey,
    movKey,
    getAggregatedHistory,
    getMovAggregatedHistory,
  } = useWorkoutLog(day);

  const handleDayChange = (dayIdx: number) => {
    setActiveDay(dayIdx);
    setExpanded(null);
  };

  return (
    <div>
      <Header storageReady={storageReady} />
      <TabBar activeTab={tab} accentColor={day.color} onTabChange={setTab} />

      {tab === 'plan' && (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px' }}>
          <SessionFlow />
          <DaySelector activeDay={activeDay} onDayChange={handleDayChange} />
          <DayHeader day={day} progress={progress} doneSets={doneSets} totalSets={totalSets} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {day.exercises.map((ex, exIdx) => (
              <ExerciseCard
                key={exIdx}
                exercise={ex}
                exIdx={exIdx}
                day={day}
                expanded={expanded === exIdx}
                onToggle={() => setExpanded(expanded === exIdx ? null : exIdx)}
                isSetDone={isSetDone}
                lastEntry={lastEntry}
                getDraft={getDraft}
                updateDraft={updateDraft}
                getMovDraft={getMovDraft}
                updateMovDraft={updateMovDraft}
                lastMovEntry={lastMovEntry}
                logSet={logSet}
                uneditSet={uneditSet}
                log={log}
                movKey={movKey}
                getLogEntry={(eIdx, sIdx) => {
                  const entries = log[setKey(eIdx, sIdx)];
                  if (!entries || entries.length === 0) return undefined;
                  const last = entries[entries.length - 1];
                  return { weight: last.weight, reps: last.reps, date: '' };
                }}
                getAggregatedHistory={getAggregatedHistory}
                getMovAggregatedHistory={getMovAggregatedHistory}
              />
            ))}
          </div>

          <CardioNote day={day} />
        </div>
      )}

      {tab === 'progress' && (
        <ProgressTab
          activeDay={activeDay}
          onDayChange={handleDayChange}
          getAggregatedHistory={getAggregatedHistory}
          getMovAggregatedHistory={getMovAggregatedHistory}
        />
      )}

      {tab === 'prehab' && <PrehabTab />}
      {tab === 'tips' && <TipsTab />}
    </div>
  );
}
