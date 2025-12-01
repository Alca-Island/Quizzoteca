import { useState } from 'react';
import { Layout } from './components/Layout';
import { QuizList } from './features/editor/QuizList';
import { QuizPlayer } from './features/play/QuizPlayer';

function App() {
  const [mode, setMode] = useState<'editor' | 'play'>('editor');

  return (
    <Layout currentMode={mode} onModeChange={setMode}>
      {mode === 'editor' ? (
        <QuizList />
      ) : (
        <QuizPlayer />
      )}
    </Layout>
  );
}

export default App;
